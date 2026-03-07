"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GitIntegrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitIntegrationService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../database/prisma.service");
const axios_1 = require("axios");
let GitIntegrationService = GitIntegrationService_1 = class GitIntegrationService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(GitIntegrationService_1.name);
    }
    async verifyProjectAccess(projectId, userId) {
        const project = await this.prisma.project.findFirst({
            where: {
                id: projectId,
                company: { OR: [{ userId }, { members: { some: { userId } } }] },
            },
        });
        if (!project)
            throw new common_1.ForbiddenException('Sem acesso a este projeto');
        return project;
    }
    async verifyRepoAccess(repoId, userId) {
        const repo = await this.prisma.gitRepository.findUnique({
            where: { id: repoId },
            include: { project: { include: { company: { include: { members: true } } } } },
        });
        if (!repo)
            throw new common_1.NotFoundException('Repositório não encontrado');
        const company = repo.project.company;
        const hasAccess = company.userId === userId || company.members.some((m) => m.userId === userId);
        if (!hasAccess)
            throw new common_1.ForbiddenException('Sem acesso a este repositório');
        return repo;
    }
    async connectRepo(dto, userId) {
        await this.verifyProjectAccess(dto.projectId, userId);
        const webhookSecret = (0, crypto_1.createHmac)('sha256', Date.now().toString())
            .update(dto.repoFullName)
            .digest('hex')
            .substring(0, 32);
        const repo = await this.prisma.gitRepository.upsert({
            where: { projectId_repoFullName: { projectId: dto.projectId, repoFullName: dto.repoFullName } },
            create: {
                projectId: dto.projectId,
                repoFullName: dto.repoFullName,
                defaultBranch: dto.defaultBranch ?? 'main',
                accessToken: dto.accessToken,
                webhookSecret,
                prOpenedStatus: dto.prOpenedStatus ?? 'IN_REVIEW',
                prMergedStatus: dto.prMergedStatus ?? 'IN_DEPLOY',
                prClosedStatus: dto.prClosedStatus ?? null,
            },
            update: {
                defaultBranch: dto.defaultBranch ?? 'main',
                accessToken: dto.accessToken,
                prOpenedStatus: dto.prOpenedStatus ?? 'IN_REVIEW',
                prMergedStatus: dto.prMergedStatus ?? 'IN_DEPLOY',
                prClosedStatus: dto.prClosedStatus ?? null,
                isActive: true,
            },
        });
        return {
            ...repo,
            accessToken: repo.accessToken ? '***' : null,
            webhookUrl: `${process.env.API_BASE_URL ?? 'http://localhost:3001'}/api/git/webhook`,
            webhookSecret: repo.webhookSecret,
        };
    }
    async getReposByProject(projectId, userId) {
        await this.verifyProjectAccess(projectId, userId);
        const repos = await this.prisma.gitRepository.findMany({
            where: { projectId },
            include: { _count: { select: { pullRequests: true } } },
            orderBy: { createdAt: 'desc' },
        });
        return repos.map((r) => ({ ...r, accessToken: r.accessToken ? '***' : null }));
    }
    async updateRepo(repoId, dto, userId) {
        await this.verifyRepoAccess(repoId, userId);
        const repo = await this.prisma.gitRepository.update({
            where: { id: repoId },
            data: {
                ...(dto.defaultBranch && { defaultBranch: dto.defaultBranch }),
                ...(dto.accessToken !== undefined && { accessToken: dto.accessToken }),
                ...(dto.prOpenedStatus !== undefined && { prOpenedStatus: dto.prOpenedStatus }),
                ...(dto.prMergedStatus !== undefined && { prMergedStatus: dto.prMergedStatus }),
                ...(dto.prClosedStatus !== undefined && { prClosedStatus: dto.prClosedStatus }),
            },
        });
        return { ...repo, accessToken: repo.accessToken ? '***' : null };
    }
    async disconnectRepo(repoId, userId) {
        await this.verifyRepoAccess(repoId, userId);
        await this.prisma.gitRepository.delete({ where: { id: repoId } });
        return { message: 'Repositório desconectado' };
    }
    async getPullRequests(projectId, userId, opts) {
        await this.verifyProjectAccess(projectId, userId);
        return this.prisma.gitPullRequest.findMany({
            where: {
                repository: { projectId },
                ...(opts?.state && { state: opts.state }),
                ...(opts?.taskId && { taskId: opts.taskId }),
                ...(opts?.repoId && { repositoryId: opts.repoId }),
            },
            include: {
                repository: { select: { id: true, repoFullName: true } },
                task: { select: { id: true, title: true, status: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async linkPrToTask(prId, dto, userId) {
        const pr = await this.prisma.gitPullRequest.findUnique({
            where: { id: prId },
            include: {
                repository: {
                    include: {
                        project: { include: { company: { include: { members: true } } } },
                    },
                },
            },
        });
        if (!pr)
            throw new common_1.NotFoundException('PR não encontrado');
        const company = pr.repository.project.company;
        const hasAccess = company.userId === userId || company.members.some((m) => m.userId === userId);
        if (!hasAccess)
            throw new common_1.ForbiddenException('Sem acesso');
        if (dto.taskId) {
            const task = await this.prisma.task.findFirst({
                where: { id: dto.taskId, projectId: pr.repository.projectId },
            });
            if (!task)
                throw new common_1.BadRequestException('Tarefa não pertence a este projeto');
        }
        const updated = await this.prisma.gitPullRequest.update({
            where: { id: prId },
            data: { taskId: dto.taskId ?? null },
            include: {
                repository: { select: { id: true, repoFullName: true, prMergedStatus: true, prClosedStatus: true } },
                task: { select: { id: true, title: true, status: true } },
            },
        });
        if (dto.taskId && pr.state === 'merged' && updated.repository.prMergedStatus) {
            await this.prisma.task.update({
                where: { id: dto.taskId },
                data: { status: updated.repository.prMergedStatus },
            });
            this.logger.log(`[link] Task ${dto.taskId} → ${updated.repository.prMergedStatus} (PR #${pr.prNumber} already merged)`);
        }
        return updated;
    }
    async syncFromGitHub(repoId, userId) {
        const repo = await this.verifyRepoAccess(repoId, userId);
        if (!repo.accessToken) {
            throw new common_1.BadRequestException('PAT (Personal Access Token) não configurado para este repositório');
        }
        const headers = {
            Authorization: `token ${repo.accessToken}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
        };
        try {
            await axios_1.default.get(`https://api.github.com/repos/${repo.repoFullName}`, { headers });
        }
        catch (e) {
            const status = e?.response?.status;
            const ghMsg = e?.response?.data?.message ?? e.message;
            if (status === 401)
                throw new common_1.BadRequestException(`Token inválido ou expirado. GitHub: ${ghMsg}`);
            if (status === 403)
                throw new common_1.BadRequestException(`Token sem permissão para este repositório. GitHub: ${ghMsg}. Verifique os escopos: repo (classic) ou pull_requests:read (fine-grained).`);
            if (status === 404)
                throw new common_1.BadRequestException(`Repositório "${repo.repoFullName}" não encontrado. Verifique o nome (owner/repo) e se o token tem acesso a ele.`);
            throw new common_1.BadRequestException(`Erro ao acessar GitHub (HTTP ${status ?? 'network error'}): ${ghMsg}`);
        }
        try {
            const [openRes, closedRes] = await Promise.all([
                axios_1.default.get(`https://api.github.com/repos/${repo.repoFullName}/pulls?state=open&per_page=50`, { headers }),
                axios_1.default.get(`https://api.github.com/repos/${repo.repoFullName}/pulls?state=closed&per_page=20`, { headers }),
            ]);
            const prs = [...openRes.data, ...closedRes.data];
            let synced = 0;
            for (const pr of prs) {
                const state = pr.merged_at ? 'merged' : pr.state;
                const taskId = await this.findTaskByBranchOrTitle(repo.projectId, pr.head.ref, pr.title);
                const upsertedPr = await this.prisma.gitPullRequest.upsert({
                    where: { repositoryId_prNumber: { repositoryId: repo.id, prNumber: pr.number } },
                    create: {
                        repositoryId: repo.id,
                        prNumber: pr.number,
                        prTitle: pr.title,
                        prUrl: pr.html_url,
                        branch: pr.head.ref,
                        baseBranch: pr.base.ref,
                        state,
                        author: pr.user?.login ?? 'unknown',
                        authorAvatar: pr.user?.avatar_url,
                        mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
                        closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
                        taskId,
                    },
                    update: {
                        prTitle: pr.title,
                        state,
                        mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
                        closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
                        authorAvatar: pr.user?.avatar_url,
                        ...(taskId && !pr.taskId && { taskId }),
                    },
                });
                const effectiveTaskId = upsertedPr.taskId;
                if (state === 'merged' && effectiveTaskId && repo.prMergedStatus) {
                    await this.prisma.task.update({
                        where: { id: effectiveTaskId },
                        data: { status: repo.prMergedStatus },
                    });
                    this.logger.log(`[sync] Task ${effectiveTaskId} → ${repo.prMergedStatus} (PR #${pr.number} merged)`);
                }
                synced++;
            }
            return { synced, message: `${synced} PRs sincronizados` };
        }
        catch (e) {
            const status = e?.response?.status;
            const msg = e?.response?.data?.message ?? e.message;
            this.logger.error(`Sync error for repo ${repo.repoFullName}: HTTP ${status} — ${msg}`);
            throw new common_1.BadRequestException(`Erro ao buscar PRs (HTTP ${status ?? 'interno'}): ${msg}`);
        }
    }
    async handleWebhook(body, signature, repoFullName) {
        const repo = await this.prisma.gitRepository.findFirst({
            where: { repoFullName, isActive: true },
        });
        if (!repo) {
            this.logger.warn(`Webhook received for unknown repo: ${repoFullName}`);
            return { ignored: true };
        }
        if (repo.webhookSecret && signature) {
            const expected = `sha256=${(0, crypto_1.createHmac)('sha256', repo.webhookSecret)
                .update(JSON.stringify(body))
                .digest('hex')}`;
            if (signature !== expected) {
                this.logger.warn(`Invalid webhook signature for repo: ${repoFullName}`);
                return { ignored: true, reason: 'invalid_signature' };
            }
        }
        const action = body.action;
        const pr = body.pull_request;
        if (!pr)
            return { ignored: true, reason: 'not_a_pr_event' };
        const state = pr.merged_at ? 'merged' : pr.state;
        const taskId = await this.findTaskByBranchOrTitle(repo.projectId, pr.head.ref, pr.title);
        const existingPr = await this.prisma.gitPullRequest.findUnique({
            where: { repositoryId_prNumber: { repositoryId: repo.id, prNumber: pr.number } },
        });
        const upserted = await this.prisma.gitPullRequest.upsert({
            where: { repositoryId_prNumber: { repositoryId: repo.id, prNumber: pr.number } },
            create: {
                repositoryId: repo.id,
                prNumber: pr.number,
                prTitle: pr.title,
                prUrl: pr.html_url,
                branch: pr.head.ref,
                baseBranch: pr.base.ref,
                state,
                author: pr.user?.login ?? 'unknown',
                authorAvatar: pr.user?.avatar_url,
                mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
                closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
                taskId,
            },
            update: {
                prTitle: pr.title,
                state,
                mergedAt: pr.merged_at ? new Date(pr.merged_at) : null,
                closedAt: pr.closed_at ? new Date(pr.closed_at) : null,
                authorAvatar: pr.user?.avatar_url,
                ...(!existingPr?.taskId && taskId ? { taskId } : {}),
            },
        });
        const effectiveTaskId = upserted.taskId;
        if (effectiveTaskId) {
            let newStatus = null;
            if (action === 'opened' || action === 'reopened') {
                newStatus = repo.prOpenedStatus;
            }
            else if (action === 'closed' && pr.merged) {
                newStatus = repo.prMergedStatus;
            }
            else if (action === 'closed' && !pr.merged) {
                newStatus = repo.prClosedStatus ?? null;
            }
            if (newStatus) {
                await this.prisma.task.update({
                    where: { id: effectiveTaskId },
                    data: { status: newStatus },
                });
                this.logger.log(`Task ${effectiveTaskId} status → ${newStatus} (PR #${pr.number} ${action})`);
            }
        }
        return { processed: true, prNumber: pr.number, action, taskLinked: !!effectiveTaskId };
    }
    async handleCiWebhook(body, repoFullName) {
        const checkRun = body.check_run;
        if (!checkRun)
            return { ignored: true };
        const repo = await this.prisma.gitRepository.findFirst({ where: { repoFullName, isActive: true } });
        if (!repo)
            return { ignored: true };
        const conclusion = checkRun.conclusion;
        const ciStatus = conclusion ?? checkRun.status;
        const prNumber = checkRun.pull_requests?.[0]?.number;
        if (prNumber) {
            await this.prisma.gitPullRequest.updateMany({
                where: { repositoryId: repo.id, prNumber },
                data: { ciStatus },
            });
            if (conclusion === 'success') {
                const mergedPr = await this.prisma.gitPullRequest.findFirst({
                    where: { repositoryId: repo.id, prNumber, state: 'merged', taskId: { not: null } },
                });
                if (mergedPr?.taskId) {
                    await this.prisma.task.update({
                        where: { id: mergedPr.taskId },
                        data: { status: 'DONE' },
                    });
                    this.logger.log(`[ci] Task ${mergedPr.taskId} → DONE (PR #${prNumber} CI success)`);
                }
            }
        }
        return { processed: true, ciStatus };
    }
    async findTaskByBranchOrTitle(projectId, branch, prTitle) {
        const branchParts = branch.split('/');
        const possibleId = branchParts[branchParts.length - 1];
        if (possibleId && possibleId.length >= 20) {
            const task = await this.prisma.task.findFirst({ where: { id: possibleId, projectId } });
            if (task)
                return task.id;
        }
        const idMatch = (prTitle + ' ' + branch).match(/\[([a-z0-9]{20,})\]|#([a-z0-9]{20,})/i);
        if (idMatch) {
            const id = idMatch[1] ?? idMatch[2];
            const task = await this.prisma.task.findFirst({ where: { id, projectId } });
            if (task)
                return task.id;
        }
        return null;
    }
    async getProjectsWithRepos(userId) {
        return this.prisma.project.findMany({
            where: {
                company: { OR: [{ userId }, { members: { some: { userId } } }] },
            },
            include: {
                repositories: {
                    select: { id: true, repoFullName: true, isActive: true, _count: { select: { pullRequests: true } } },
                },
                company: { select: { id: true, name: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
};
exports.GitIntegrationService = GitIntegrationService;
exports.GitIntegrationService = GitIntegrationService = GitIntegrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GitIntegrationService);
//# sourceMappingURL=git-integration.service.js.map