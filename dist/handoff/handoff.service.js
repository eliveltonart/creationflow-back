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
exports.HandoffService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const create_handoff_dto_1 = require("./dto/create-handoff.dto");
const HANDOFF_INCLUDE = {
    project: { select: { id: true, name: true, companyId: true } },
    designer: { select: { id: true, name: true, email: true } },
    developer: { select: { id: true, name: true, email: true } },
    components: { orderBy: { order: 'asc' } },
    comments: {
        where: { parentId: null },
        include: {
            author: { select: { id: true, name: true, email: true } },
            replies: {
                include: { author: { select: { id: true, name: true, email: true } } },
                orderBy: { createdAt: 'asc' },
            },
        },
        orderBy: { createdAt: 'desc' },
    },
    linkedTasks: {
        include: {
            task: { select: { id: true, title: true, status: true, type: true } },
        },
    },
    _count: { select: { components: true, comments: true } },
};
const STATUS_TRANSITIONS = {
    [create_handoff_dto_1.HandoffStatus.DRAFT]: [create_handoff_dto_1.HandoffStatus.READY, create_handoff_dto_1.HandoffStatus.ARCHIVED],
    [create_handoff_dto_1.HandoffStatus.READY]: [create_handoff_dto_1.HandoffStatus.IMPLEMENTING, create_handoff_dto_1.HandoffStatus.DRAFT, create_handoff_dto_1.HandoffStatus.ARCHIVED],
    [create_handoff_dto_1.HandoffStatus.IMPLEMENTING]: [create_handoff_dto_1.HandoffStatus.IMPLEMENTED, create_handoff_dto_1.HandoffStatus.READY, create_handoff_dto_1.HandoffStatus.ARCHIVED],
    [create_handoff_dto_1.HandoffStatus.IMPLEMENTED]: [create_handoff_dto_1.HandoffStatus.APPROVED, create_handoff_dto_1.HandoffStatus.IMPLEMENTING, create_handoff_dto_1.HandoffStatus.ARCHIVED],
    [create_handoff_dto_1.HandoffStatus.APPROVED]: [create_handoff_dto_1.HandoffStatus.ARCHIVED],
    [create_handoff_dto_1.HandoffStatus.ARCHIVED]: [],
};
let HandoffService = class HandoffService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertAccess(handoffId, userId) {
        const handoff = await this.prisma.designHandoff.findUnique({
            where: { id: handoffId },
            include: { project: true },
        });
        if (!handoff)
            throw new common_1.NotFoundException('Handoff not found');
        const companyId = handoff.project.companyId;
        const company = await this.prisma.company.findFirst({
            where: { id: companyId, userId },
        });
        const member = await this.prisma.companyMember.findFirst({
            where: { companyId, userId },
        });
        if (!company && !member)
            throw new common_1.ForbiddenException();
        return handoff;
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
        return this.prisma.$transaction(async (tx) => {
            const handoff = await tx.designHandoff.create({
                data: {
                    title: dto.title,
                    description: dto.description,
                    rationale: dto.rationale,
                    userJourneyContext: dto.userJourneyContext,
                    projectId: dto.projectId,
                    designerId: userId,
                    developerId: dto.developerId,
                },
            });
            const task = await tx.task.create({
                data: {
                    title: `[Handoff] ${dto.title}`,
                    description: `Handoff ID: ${handoff.id}\n\nTarefa criada automaticamente para rastrear a implementação do handoff de design.`,
                    type: 'TASK',
                    status: 'TODO',
                    priority: 'MEDIUM',
                    projectId: dto.projectId,
                    userId,
                },
            });
            await tx.handoffLinkedTask.create({
                data: { handoffId: handoff.id, taskId: task.id },
            });
            return tx.designHandoff.findUnique({
                where: { id: handoff.id },
                include: HANDOFF_INCLUDE,
            });
        });
    }
    async findAll(userId, projectId, status) {
        const owned = await this.prisma.company.findMany({
            where: { userId },
            select: { id: true },
        });
        const membered = await this.prisma.companyMember.findMany({
            where: { userId },
            select: { companyId: true },
        });
        const companyIds = [
            ...owned.map((c) => c.id),
            ...membered.map((m) => m.companyId),
        ];
        return this.prisma.designHandoff.findMany({
            where: {
                project: { companyId: { in: companyIds } },
                ...(projectId ? { projectId } : {}),
                ...(status ? { status: status } : {}),
            },
            include: HANDOFF_INCLUDE,
            orderBy: { updatedAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        await this.assertAccess(id, userId);
        return this.prisma.designHandoff.findUnique({
            where: { id },
            include: HANDOFF_INCLUDE,
        });
    }
    async update(id, dto, userId) {
        const handoff = await this.assertAccess(id, userId);
        if (handoff.status !== create_handoff_dto_1.HandoffStatus.DRAFT &&
            handoff.status !== create_handoff_dto_1.HandoffStatus.READY) {
            throw new common_1.BadRequestException('Cannot edit a handoff that is being implemented or has been approved');
        }
        return this.prisma.designHandoff.update({
            where: { id },
            data: { ...dto },
            include: HANDOFF_INCLUDE,
        });
    }
    async updateStatus(id, dto, userId) {
        const handoff = await this.assertAccess(id, userId);
        const allowed = STATUS_TRANSITIONS[handoff.status];
        if (!allowed.includes(dto.status)) {
            throw new common_1.BadRequestException(`Cannot transition from ${handoff.status} to ${dto.status}`);
        }
        const data = { status: dto.status };
        if (dto.status === create_handoff_dto_1.HandoffStatus.READY) {
            data.submittedAt = new Date();
            data.iterationCount = { increment: 1 };
        }
        if (dto.status === create_handoff_dto_1.HandoffStatus.APPROVED) {
            data.completedAt = new Date();
        }
        return this.prisma.designHandoff.update({
            where: { id },
            data,
            include: HANDOFF_INCLUDE,
        });
    }
    async remove(id, userId) {
        const handoff = await this.assertAccess(id, userId);
        if (handoff.designerId !== userId) {
            throw new common_1.ForbiddenException('Only the designer can delete a handoff');
        }
        await this.prisma.designHandoff.delete({ where: { id } });
        return { deleted: true };
    }
    async createComponent(handoffId, dto, userId) {
        await this.assertAccess(handoffId, userId);
        return this.prisma.handoffComponent.create({
            data: { ...dto, handoffId },
        });
    }
    async updateComponent(handoffId, componentId, dto, userId) {
        await this.assertAccess(handoffId, userId);
        return this.prisma.handoffComponent.update({
            where: { id: componentId },
            data: { ...dto },
        });
    }
    async removeComponent(handoffId, componentId, userId) {
        await this.assertAccess(handoffId, userId);
        await this.prisma.handoffComponent.delete({ where: { id: componentId } });
        return { deleted: true };
    }
    async createComment(handoffId, dto, userId) {
        await this.assertAccess(handoffId, userId);
        return this.prisma.handoffComment.create({
            data: {
                text: dto.text,
                componentId: dto.componentId,
                parentId: dto.parentId,
                handoffId,
                authorId: userId,
            },
            include: {
                author: { select: { id: true, name: true, email: true } },
                replies: {
                    include: { author: { select: { id: true, name: true, email: true } } },
                },
            },
        });
    }
    async resolveComment(handoffId, commentId, userId) {
        await this.assertAccess(handoffId, userId);
        return this.prisma.handoffComment.update({
            where: { id: commentId },
            data: { resolved: true },
        });
    }
    async linkTasks(handoffId, dto, userId) {
        await this.assertAccess(handoffId, userId);
        await this.prisma.handoffLinkedTask.createMany({
            data: dto.taskIds.map((taskId) => ({ handoffId, taskId })),
            skipDuplicates: true,
        });
        return this.findOne(handoffId, userId);
    }
    async unlinkTask(handoffId, taskId, userId) {
        await this.assertAccess(handoffId, userId);
        await this.prisma.handoffLinkedTask.deleteMany({
            where: { handoffId, taskId },
        });
        return { deleted: true };
    }
    async getAccessibleProjects(userId) {
        const owned = await this.prisma.company.findMany({
            where: { userId },
            select: { id: true },
        });
        const membered = await this.prisma.companyMember.findMany({
            where: { userId },
            select: { companyId: true },
        });
        const companyIds = [
            ...owned.map((c) => c.id),
            ...membered.map((m) => m.companyId),
        ];
        return this.prisma.project.findMany({
            where: { companyId: { in: companyIds } },
            select: { id: true, name: true, companyId: true, company: { select: { name: true } } },
            orderBy: { name: 'asc' },
        });
    }
};
exports.HandoffService = HandoffService;
exports.HandoffService = HandoffService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HandoffService);
//# sourceMappingURL=handoff.service.js.map