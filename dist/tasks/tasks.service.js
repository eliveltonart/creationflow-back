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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const client_1 = require("@prisma/client");
let TasksService = class TasksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async verifyProjectAccess(projectId, userId) {
        const project = await this.prisma.project.findFirst({
            where: {
                id: projectId,
                company: {
                    OR: [{ userId }, { members: { some: { userId } } }],
                },
            },
        });
        if (!project)
            throw new common_1.ForbiddenException('Sem acesso a este projeto');
        return project;
    }
    async create(dto, userId) {
        await this.verifyProjectAccess(dto.projectId, userId);
        return this.prisma.task.create({
            data: {
                title: dto.title,
                projectId: dto.projectId,
                userId,
                type: dto.type,
                status: dto.status,
                priority: dto.priority,
                storyPoints: dto.storyPoints,
                estimatedHours: dto.estimatedHours,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
                sprintId: dto.sprintId ?? null,
                description: dto.description,
                assignees: dto.assignees ?? [],
                prValidators: dto.prValidators ?? [],
                testers: dto.testers ?? [],
                dod: dto.dod ?? [],
            },
            include: { sprint: { select: { id: true, name: true } } },
        });
    }
    async findByProject(projectId, userId) {
        await this.verifyProjectAccess(projectId, userId);
        const tasks = await this.prisma.task.findMany({
            where: { projectId },
            include: { sprint: { select: { id: true, name: true } } },
            orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
        });
        const grouped = {};
        for (const s of Object.values(client_1.TaskStatus))
            grouped[s] = [];
        for (const t of tasks)
            grouped[t.status].push(t);
        return grouped;
    }
    async findBySprint(sprintId, userId) {
        const sprint = await this.prisma.sprint.findFirst({ where: { id: sprintId } });
        if (!sprint)
            throw new common_1.NotFoundException('Sprint não encontrada');
        await this.verifyProjectAccess(sprint.projectId, userId);
        return this.prisma.task.findMany({
            where: { sprintId },
            include: { sprint: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const task = await this.prisma.task.findFirst({
            where: { id },
            include: { sprint: { select: { id: true, name: true } } },
        });
        if (!task)
            throw new common_1.NotFoundException('Tarefa não encontrada');
        await this.verifyProjectAccess(task.projectId, userId);
        return task;
    }
    async update(id, dto, userId) {
        const task = await this.prisma.task.findFirst({ where: { id } });
        if (!task)
            throw new common_1.NotFoundException('Tarefa não encontrada');
        await this.verifyProjectAccess(task.projectId, userId);
        return this.prisma.task.update({
            where: { id },
            data: {
                ...dto,
                dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
                sprintId: dto.sprintId !== undefined ? (dto.sprintId || null) : undefined,
            },
            include: { sprint: { select: { id: true, name: true } } },
        });
    }
    async updateDodItem(id, index, completed, userId) {
        const task = await this.findOne(id, userId);
        const dod = task.dod ?? [];
        if (index < 0 || index >= dod.length)
            throw new common_1.NotFoundException('Item DoD não encontrado');
        dod[index].completed = completed;
        return this.prisma.task.update({ where: { id }, data: { dod } });
    }
    async remove(id, userId) {
        const task = await this.prisma.task.findFirst({ where: { id } });
        if (!task)
            throw new common_1.NotFoundException('Tarefa não encontrada');
        await this.verifyProjectAccess(task.projectId, userId);
        return this.prisma.task.delete({ where: { id } });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map