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
exports.SprintsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let SprintsService = class SprintsService {
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
        return this.prisma.sprint.create({
            data: {
                name: dto.name,
                goal: dto.goal,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
                isActive: dto.isActive ?? false,
                projectId: dto.projectId,
            },
            include: { _count: { select: { tasks: true } } },
        });
    }
    async findByProject(projectId, userId) {
        await this.verifyProjectAccess(projectId, userId);
        return this.prisma.sprint.findMany({
            where: { projectId },
            include: { _count: { select: { tasks: true } } },
            orderBy: [{ isActive: 'desc' }, { startDate: 'desc' }],
        });
    }
    async update(id, dto, userId) {
        const sprint = await this.prisma.sprint.findFirst({
            where: { id },
            include: { project: true },
        });
        if (!sprint)
            throw new common_1.NotFoundException('Sprint não encontrada');
        await this.verifyProjectAccess(sprint.projectId, userId);
        if (dto.isActive) {
            await this.prisma.sprint.updateMany({
                where: { projectId: sprint.projectId, id: { not: id } },
                data: { isActive: false },
            });
        }
        return this.prisma.sprint.update({
            where: { id },
            data: {
                ...dto,
                startDate: dto.startDate ? new Date(dto.startDate) : undefined,
                endDate: dto.endDate ? new Date(dto.endDate) : undefined,
            },
            include: { _count: { select: { tasks: true } } },
        });
    }
    async remove(id, userId) {
        const sprint = await this.prisma.sprint.findFirst({ where: { id } });
        if (!sprint)
            throw new common_1.NotFoundException('Sprint não encontrada');
        await this.verifyProjectAccess(sprint.projectId, userId);
        return this.prisma.sprint.delete({ where: { id } });
    }
};
exports.SprintsService = SprintsService;
exports.SprintsService = SprintsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SprintsService);
//# sourceMappingURL=sprints.service.js.map