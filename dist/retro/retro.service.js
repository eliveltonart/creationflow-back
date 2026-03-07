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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetroService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const retro_dto_1 = require("./dto/retro.dto");
const RETRO_INCLUDE = {
    project: { select: { id: true, name: true, companyId: true } },
    facilitator: { select: { id: true, name: true, email: true } },
    sprint: { select: { id: true, name: true } },
    task: { select: { id: true, title: true } },
    cards: {
        include: {
            author: { select: { id: true, name: true, email: true } },
            votes: true,
            actions: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'asc' },
    },
    actions: {
        include: {
            card: { select: { id: true, content: true, category: true } },
            assignee: { select: { id: true, name: true, email: true } },
            task: { select: { id: true, title: true, status: true } },
        },
        orderBy: { createdAt: 'asc' },
    },
    participants: {
        include: {
            user: { select: { id: true, name: true, email: true } },
        },
    },
    _count: { select: { cards: true, actions: true, participants: true } },
};
const STATUS_ORDER = [
    retro_dto_1.RetroStatus.DRAFT,
    retro_dto_1.RetroStatus.COLECT,
    retro_dto_1.RetroStatus.VOTE,
    retro_dto_1.RetroStatus.ACT,
    retro_dto_1.RetroStatus.CLOSED,
];
let RetroService = class RetroService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertFacilitator(retroId, userId) {
        const retro = await this.prisma.retrospective.findUnique({
            where: { id: retroId },
            include: { project: true },
        });
        if (!retro)
            throw new common_1.NotFoundException('Retro not found');
        const company = await this.prisma.company.findFirst({
            where: { id: retro.project.companyId, userId },
        });
        const member = await this.prisma.companyMember.findFirst({
            where: { companyId: retro.project.companyId, userId },
        });
        if (!company && !member)
            throw new common_1.ForbiddenException();
        return retro;
    }
    async assertAccess(retroId, userId) {
        return this.assertFacilitator(retroId, userId);
    }
    async create(dto, userId) {
        const project = await this.prisma.project.findUnique({ where: { id: dto.projectId } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        const company = await this.prisma.company.findFirst({
            where: { id: project.companyId, userId },
        });
        const member = await this.prisma.companyMember.findFirst({
            where: { companyId: project.companyId, userId },
        });
        if (!company && !member)
            throw new common_1.ForbiddenException();
        if (dto.sprintId && dto.taskId) {
            throw new common_1.BadRequestException('A retro cannot be linked to both a sprint and a task');
        }
        const retro = await this.prisma.retrospective.create({
            data: {
                title: dto.title,
                description: dto.description,
                projectId: dto.projectId,
                facilitatorId: userId,
                sprintId: dto.sprintId,
                taskId: dto.taskId,
                isAnonymous: dto.isAnonymous ?? false,
                voteLimit: dto.voteLimit ?? 5,
                col1Name: dto.col1Name ?? 'Went Well',
                col1Color: dto.col1Color ?? '#22c55e',
                col2Name: dto.col2Name ?? 'Needs Improvement',
                col2Color: dto.col2Color ?? '#f97316',
                col3Name: dto.col3Name ?? 'Action Items',
                col3Color: dto.col3Color ?? '#3b82f6',
            },
            include: RETRO_INCLUDE,
        });
        await this.prisma.retroParticipant.create({
            data: { retroId: retro.id, userId, name: '' },
        });
        return retro;
    }
    async findAll(userId, projectId, status) {
        const owned = await this.prisma.company.findMany({ where: { userId }, select: { id: true } });
        const membered = await this.prisma.companyMember.findMany({ where: { userId }, select: { companyId: true } });
        const companyIds = [...owned.map((c) => c.id), ...membered.map((m) => m.companyId)];
        return this.prisma.retrospective.findMany({
            where: {
                project: { companyId: { in: companyIds } },
                ...(projectId ? { projectId } : {}),
                ...(status ? { status: status } : {}),
            },
            include: RETRO_INCLUDE,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByShareToken(token) {
        const retro = await this.prisma.retrospective.findUnique({
            where: { shareToken: token },
            include: RETRO_INCLUDE,
        });
        if (!retro)
            throw new common_1.NotFoundException('Retro not found');
        return retro;
    }
    async findOne(id, userId) {
        await this.assertAccess(id, userId);
        return this.prisma.retrospective.findUnique({ where: { id }, include: RETRO_INCLUDE });
    }
    async update(id, dto, userId) {
        const retro = await this.assertFacilitator(id, userId);
        if (retro.isLocked)
            throw new common_1.ForbiddenException('Retro is closed');
        return this.prisma.retrospective.update({ where: { id }, data: dto, include: RETRO_INCLUDE });
    }
    async delete(id, userId) {
        await this.assertFacilitator(id, userId);
        return this.prisma.retrospective.delete({ where: { id } });
    }
    async revokeShareToken(id, userId) {
        await this.assertFacilitator(id, userId);
        return this.prisma.retrospective.update({
            where: { id },
            data: { shareToken: Math.random().toString(36).slice(2) + Date.now().toString(36) },
        });
    }
    async advancePhase(id, userId) {
        const retro = await this.assertFacilitator(id, userId);
        if (retro.isLocked)
            throw new common_1.ForbiddenException('Retro is closed');
        const currentIdx = STATUS_ORDER.indexOf(retro.status);
        if (currentIdx === STATUS_ORDER.length - 1)
            throw new common_1.BadRequestException('Already at final phase');
        const nextStatus = STATUS_ORDER[currentIdx + 1];
        const isClosing = nextStatus === retro_dto_1.RetroStatus.CLOSED;
        return this.prisma.retrospective.update({
            where: { id },
            data: {
                status: nextStatus,
                isLocked: isClosing,
                closedAt: isClosing ? new Date() : undefined,
            },
            include: RETRO_INCLUDE,
        });
    }
    async createCard(retroId, dto, userId) {
        const retro = await this.prisma.retrospective.findUnique({ where: { id: retroId } });
        if (!retro)
            throw new common_1.NotFoundException('Retro not found');
        if (retro.isLocked)
            throw new common_1.ForbiddenException('Retro is closed');
        if (retro.status !== retro_dto_1.RetroStatus.COLECT)
            throw new common_1.BadRequestException('Cards can only be added during Colect phase');
        return this.prisma.retroCard.create({
            data: {
                content: dto.content,
                category: dto.category,
                retroId,
                authorId: userId || null,
                authorName: !userId ? (dto.guestName ?? 'Anônimo') : null,
            },
            include: { author: { select: { id: true, name: true, email: true } }, votes: true, actions: { select: { id: true, title: true } } },
        });
    }
    async updateCard(retroId, cardId, dto, userId) {
        const card = await this.prisma.retroCard.findFirst({ where: { id: cardId, retroId } });
        if (!card)
            throw new common_1.NotFoundException('Card not found');
        const retro = await this.prisma.retrospective.findUnique({ where: { id: retroId } });
        if (retro.isLocked)
            throw new common_1.ForbiddenException('Retro is closed');
        if (userId && card.authorId && card.authorId !== userId)
            throw new common_1.ForbiddenException('Not your card');
        return this.prisma.retroCard.update({ where: { id: cardId }, data: dto, include: { author: { select: { id: true, name: true, email: true } }, votes: true, actions: { select: { id: true, title: true } } } });
    }
    async deleteCard(retroId, cardId, userId) {
        const card = await this.prisma.retroCard.findFirst({ where: { id: cardId, retroId } });
        if (!card)
            throw new common_1.NotFoundException('Card not found');
        if (userId && card.authorId && card.authorId !== userId)
            throw new common_1.ForbiddenException('Not your card');
        return this.prisma.retroCard.delete({ where: { id: cardId } });
    }
    async voteCard(retroId, cardId, dto, userId) {
        const retro = await this.prisma.retrospective.findUnique({ where: { id: retroId } });
        if (!retro)
            throw new common_1.NotFoundException('Retro not found');
        if (retro.isLocked)
            throw new common_1.ForbiddenException('Retro is closed');
        if (retro.status !== retro_dto_1.RetroStatus.VOTE)
            throw new common_1.BadRequestException('Voting is only allowed during Vote phase');
        const card = await this.prisma.retroCard.findFirst({ where: { id: cardId, retroId } });
        if (!card)
            throw new common_1.NotFoundException('Card not found');
        if (userId && card.authorId === userId)
            throw new common_1.BadRequestException('Cannot vote on your own card');
        const points = dto.points ?? 1;
        const voterId = userId || null;
        const guestId = dto.guestId || null;
        const used = await this.prisma.retroVote.aggregate({
            where: { card: { retroId }, voterId: voterId || undefined, guestId: guestId || undefined },
            _sum: { points: true },
        });
        const usedPoints = used._sum.points ?? 0;
        if (usedPoints + points > retro.voteLimit) {
            throw new common_1.BadRequestException(`Insufficient votes. Remaining: ${retro.voteLimit - usedPoints}`);
        }
        return this.prisma.retroVote.create({ data: { cardId, points, voterId, guestId } });
    }
    async removeVote(retroId, cardId, userId, guestId) {
        const retro = await this.prisma.retrospective.findUnique({ where: { id: retroId } });
        if (!retro || retro.isLocked)
            throw new common_1.ForbiddenException();
        const vote = await this.prisma.retroVote.findFirst({
            where: { cardId, voterId: userId || null, guestId: guestId || null },
        });
        if (!vote)
            throw new common_1.NotFoundException('Vote not found');
        return this.prisma.retroVote.delete({ where: { id: vote.id } });
    }
    async createAction(retroId, dto, userId) {
        const retro = await this.assertFacilitator(retroId, userId);
        if (retro.isLocked)
            throw new common_1.ForbiddenException('Retro is closed');
        const card = await this.prisma.retroCard.findFirst({ where: { id: dto.cardId, retroId } });
        if (!card)
            throw new common_1.NotFoundException('Card not found');
        return this.prisma.$transaction(async (tx) => {
            let linkedTaskId = null;
            if (dto.createTask && dto.taskProjectId) {
                const task = await tx.task.create({
                    data: {
                        title: `[Retro] ${dto.title}`,
                        description: `Originada de: ${retro.title}\nCard: "${card.content}"\n\n${dto.description ?? ''}`,
                        type: 'TASK',
                        status: 'TODO',
                        priority: dto.priority ?? 'MEDIUM',
                        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
                        projectId: dto.taskProjectId,
                        sprintId: dto.taskSprintId || undefined,
                        userId,
                    },
                });
                linkedTaskId = task.id;
            }
            return tx.retroAction.create({
                data: {
                    title: dto.title,
                    description: dto.description,
                    priority: dto.priority ?? 'MEDIUM',
                    dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
                    retroId,
                    cardId: dto.cardId,
                    assigneeId: dto.assigneeId || undefined,
                    taskId: linkedTaskId || undefined,
                },
                include: {
                    card: { select: { id: true, content: true, category: true } },
                    assignee: { select: { id: true, name: true, email: true } },
                    task: { select: { id: true, title: true, status: true } },
                },
            });
        });
    }
    async getProjects(userId) {
        const owned = await this.prisma.company.findMany({ where: { userId }, select: { id: true } });
        const membered = await this.prisma.companyMember.findMany({ where: { userId }, select: { companyId: true } });
        const companyIds = [...owned.map((c) => c.id), ...membered.map((m) => m.companyId)];
        return this.prisma.project.findMany({
            where: { companyId: { in: companyIds } },
            select: { id: true, name: true, companyId: true },
        });
    }
    async getProjectSprints(projectId, userId) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project)
            throw new common_1.NotFoundException();
        return this.prisma.sprint.findMany({ where: { projectId }, select: { id: true, name: true } });
    }
    async joinRetro(retroId, dto, userId) {
        const retro = await this.prisma.retrospective.findUnique({ where: { id: retroId } });
        if (!retro)
            throw new common_1.NotFoundException('Retro not found');
        const existing = await this.prisma.retroParticipant.findFirst({
            where: {
                retroId,
                ...(userId ? { userId } : { guestId: dto.guestId }),
            },
        });
        if (existing)
            return existing;
        return this.prisma.retroParticipant.create({
            data: {
                retroId,
                name: dto.name,
                userId: userId || null,
                guestId: dto.guestId || null,
            },
        });
    }
};
exports.RetroService = RetroService;
exports.RetroService = RetroService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RetroService);
//# sourceMappingURL=retro.service.js.map