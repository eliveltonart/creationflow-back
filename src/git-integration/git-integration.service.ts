import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { createHmac } from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { ConnectRepoDto } from './dto/connect-repo.dto';
import { UpdateRepoDto, LinkPrToTaskDto } from './dto/update-repo.dto';
import axios from 'axios';

@Injectable()
export class GitIntegrationService {
  private readonly logger = new Logger(GitIntegrationService.name);

  constructor(private prisma: PrismaService) {}

  // ─── Access guard ───────────────────────────────────────────────────────────

  private async verifyProjectAccess(projectId: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        company: { OR: [{ userId }, { members: { some: { userId } } }] },
      },
    });
    if (!project) throw new ForbiddenException('Sem acesso a este projeto');
    return project;
  }

  private async verifyRepoAccess(repoId: string, userId: string) {
    const repo = await this.prisma.gitRepository.findUnique({
      where: { id: repoId },
      include: { project: { include: { company: { include: { members: true } } } } },
    });
    if (!repo) throw new NotFoundException('Repositório não encontrado');
    const company = repo.project.company;
    const hasAccess =
      company.userId === userId || company.members.some((m) => m.userId === userId);
    if (!hasAccess) throw new ForbiddenException('Sem acesso a este repositório');
    return repo;
  }

  // ─── Repositories ───────────────────────────────────────────────────────────

  async connectRepo(dto: ConnectRepoDto, userId: string) {
    await this.verifyProjectAccess(dto.projectId, userId);

    // Generate a webhook secret for this repo
    const webhookSecret = createHmac('sha256', Date.now().toString())
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

  async getReposByProject(projectId: string, userId: string) {
    await this.verifyProjectAccess(projectId, userId);
    const repos = await this.prisma.gitRepository.findMany({
      where: { projectId },
      include: { _count: { select: { pullRequests: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return repos.map((r) => ({ ...r, accessToken: r.accessToken ? '***' : null }));
  }

  async updateRepo(repoId: string, dto: UpdateRepoDto, userId: string) {
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

  async disconnectRepo(repoId: string, userId: string) {
    await this.verifyRepoAccess(repoId, userId);
    await this.prisma.gitRepository.delete({ where: { id: repoId } });
    return { message: 'Repositório desconectado' };
  }

  // ─── Pull Requests ───────────────────────────────────────────────────────────

  async getPullRequests(
    projectId: string,
    userId: string,
    opts?: { state?: string; taskId?: string; repoId?: string },
  ) {
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

  async linkPrToTask(prId: string, dto: LinkPrToTaskDto, userId: string) {
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
    if (!pr) throw new NotFoundException('PR não encontrado');
    const company = pr.repository.project.company;
    const hasAccess = company.userId === userId || company.members.some((m) => m.userId === userId);
    if (!hasAccess) throw new ForbiddenException('Sem acesso');

    if (dto.taskId) {
      // Validate task belongs to same project
      const task = await this.prisma.task.findFirst({
        where: { id: dto.taskId, projectId: pr.repository.projectId },
      });
      if (!task) throw new BadRequestException('Tarefa não pertence a este projeto');
    }

    const updated = await this.prisma.gitPullRequest.update({
      where: { id: prId },
      data: { taskId: dto.taskId ?? null },
      include: {
        repository: { select: { id: true, repoFullName: true, prMergedStatus: true, prClosedStatus: true } },
        task: { select: { id: true, title: true, status: true } },
      },
    });

    // If linking a task to an already-merged PR, update the task status immediately
    if (dto.taskId && pr.state === 'merged' && updated.repository.prMergedStatus) {
      await this.prisma.task.update({
        where: { id: dto.taskId },
        data: { status: updated.repository.prMergedStatus as any },
      });
      this.logger.log(`[link] Task ${dto.taskId} → ${updated.repository.prMergedStatus} (PR #${pr.prNumber} already merged)`);
    }

    return updated;
  }

  // ─── GitHub API Sync (PAT) ───────────────────────────────────────────────────

  async syncFromGitHub(repoId: string, userId: string) {
    const repo = await this.verifyRepoAccess(repoId, userId);
    if (!repo.accessToken) {
      throw new BadRequestException('PAT (Personal Access Token) não configurado para este repositório');
    }

    const headers = {
      Authorization: `token ${repo.accessToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    // Test token first with a lightweight call
    try {
      await axios.get(`https://api.github.com/repos/${repo.repoFullName}`, { headers });
    } catch (e: any) {
      const status = e?.response?.status;
      const ghMsg = e?.response?.data?.message ?? e.message;
      if (status === 401) throw new BadRequestException(`Token inválido ou expirado. GitHub: ${ghMsg}`);
      if (status === 403) throw new BadRequestException(`Token sem permissão para este repositório. GitHub: ${ghMsg}. Verifique os escopos: repo (classic) ou pull_requests:read (fine-grained).`);
      if (status === 404) throw new BadRequestException(`Repositório "${repo.repoFullName}" não encontrado. Verifique o nome (owner/repo) e se o token tem acesso a ele.`);
      throw new BadRequestException(`Erro ao acessar GitHub (HTTP ${status ?? 'network error'}): ${ghMsg}`);
    }

    try {
      // Fetch open and recently closed PRs
      const [openRes, closedRes] = await Promise.all([
        axios.get(`https://api.github.com/repos/${repo.repoFullName}/pulls?state=open&per_page=50`, { headers }),
        axios.get(`https://api.github.com/repos/${repo.repoFullName}/pulls?state=closed&per_page=20`, { headers }),
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
            // Only auto-link if not already manually linked
            ...(taskId && !pr.taskId && { taskId }),
          },
        });

        // If the PR is merged and has a linked task, update task status
        const effectiveTaskId = upsertedPr.taskId;
        if (state === 'merged' && effectiveTaskId && repo.prMergedStatus) {
          await this.prisma.task.update({
            where: { id: effectiveTaskId },
            data: { status: repo.prMergedStatus as any },
          });
          this.logger.log(`[sync] Task ${effectiveTaskId} → ${repo.prMergedStatus} (PR #${pr.number} merged)`);
        }

        synced++;
      }

      return { synced, message: `${synced} PRs sincronizados` };
    } catch (e: any) {
      const status = e?.response?.status;
      const msg = e?.response?.data?.message ?? e.message;
      this.logger.error(`Sync error for repo ${repo.repoFullName}: HTTP ${status} — ${msg}`);
      throw new BadRequestException(`Erro ao buscar PRs (HTTP ${status ?? 'interno'}): ${msg}`);
    }
  }

  // ─── Webhook handler ─────────────────────────────────────────────────────────

  async handleWebhook(body: any, signature: string, repoFullName: string) {
    // Find repository by full name
    const repo = await this.prisma.gitRepository.findFirst({
      where: { repoFullName, isActive: true },
    });
    if (!repo) {
      this.logger.warn(`Webhook received for unknown repo: ${repoFullName}`);
      return { ignored: true };
    }

    // Verify HMAC signature if secret is set
    if (repo.webhookSecret && signature) {
      const expected = `sha256=${createHmac('sha256', repo.webhookSecret)
        .update(JSON.stringify(body))
        .digest('hex')}`;
      if (signature !== expected) {
        this.logger.warn(`Invalid webhook signature for repo: ${repoFullName}`);
        return { ignored: true, reason: 'invalid_signature' };
      }
    }

    const action: string = body.action;
    const pr = body.pull_request;
    if (!pr) return { ignored: true, reason: 'not_a_pr_event' };

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
        // Auto-link only if not already linked
        ...(!existingPr?.taskId && taskId ? { taskId } : {}),
      },
    });

    // Auto-update task status based on PR event
    const effectiveTaskId = upserted.taskId;
    if (effectiveTaskId) {
      let newStatus: string | null = null;

      if (action === 'opened' || action === 'reopened') {
        newStatus = repo.prOpenedStatus;
      } else if (action === 'closed' && pr.merged) {
        newStatus = repo.prMergedStatus;
      } else if (action === 'closed' && !pr.merged) {
        newStatus = repo.prClosedStatus ?? null;
      }

      if (newStatus) {
        await this.prisma.task.update({
          where: { id: effectiveTaskId },
          data: { status: newStatus as any },
        });
        this.logger.log(`Task ${effectiveTaskId} status → ${newStatus} (PR #${pr.number} ${action})`);
      }
    }

    return { processed: true, prNumber: pr.number, action, taskLinked: !!effectiveTaskId };
  }

  // ─── CI Status webhook (check_run / check_suite) ─────────────────────────────

  async handleCiWebhook(body: any, repoFullName: string) {
    const checkRun = body.check_run;
    if (!checkRun) return { ignored: true };

    const repo = await this.prisma.gitRepository.findFirst({ where: { repoFullName, isActive: true } });
    if (!repo) return { ignored: true };

    const conclusion: string | null = checkRun.conclusion; // 'success' | 'failure' | 'neutral' | null
    const ciStatus = conclusion ?? checkRun.status; // 'queued' | 'in_progress' | 'completed'

    // Find PRs matching this check_run
    const prNumber = checkRun.pull_requests?.[0]?.number;
    if (prNumber) {
      // Update CI status on the PR record
      await this.prisma.gitPullRequest.updateMany({
        where: { repositoryId: repo.id, prNumber },
        data: { ciStatus },
      });

      // If CI succeeded, find the merged PR and move linked task to DONE
      if (conclusion === 'success') {
        const mergedPr = await this.prisma.gitPullRequest.findFirst({
          where: { repositoryId: repo.id, prNumber, state: 'merged', taskId: { not: null } },
        });

        if (mergedPr?.taskId) {
          await this.prisma.task.update({
            where: { id: mergedPr.taskId },
            data: { status: 'DONE' as any },
          });
          this.logger.log(`[ci] Task ${mergedPr.taskId} → DONE (PR #${prNumber} CI success)`);
        }
      }
    }

    return { processed: true, ciStatus };
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private async findTaskByBranchOrTitle(
    projectId: string,
    branch: string,
    prTitle: string,
  ): Promise<string | null> {
    // Pattern 1: branch ends with task cuid (e.g. feat/clxxxxxxxxxxxxxxxx)
    const branchParts = branch.split('/');
    const possibleId = branchParts[branchParts.length - 1];

    if (possibleId && possibleId.length >= 20) {
      const task = await this.prisma.task.findFirst({ where: { id: possibleId, projectId } });
      if (task) return task.id;
    }

    // Pattern 2: PR title or branch contains [taskId] or #taskId
    const idMatch = (prTitle + ' ' + branch).match(/\[([a-z0-9]{20,})\]|#([a-z0-9]{20,})/i);
    if (idMatch) {
      const id = idMatch[1] ?? idMatch[2];
      const task = await this.prisma.task.findFirst({ where: { id, projectId } });
      if (task) return task.id;
    }

    return null;
  }

  // ─── Projects list helper ────────────────────────────────────────────────────

  async getProjectsWithRepos(userId: string) {
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
}
