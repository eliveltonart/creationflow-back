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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let ProjectsService = class ProjectsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createProjectDto, userId) {
        const company = await this.prisma.company.findFirst({
            where: {
                id: createProjectDto.companyId,
                OR: [
                    { userId },
                    { members: { some: { userId } } },
                ],
            },
        });
        if (!company) {
            throw new common_1.ForbiddenException('Sem acesso a esta empresa');
        }
        return this.prisma.project.create({
            data: {
                name: createProjectDto.name,
                description: createProjectDto.description,
                status: createProjectDto.status,
                color: createProjectDto.color,
                client: createProjectDto.client,
                responsible: createProjectDto.responsible,
                startDate: createProjectDto.startDate
                    ? new Date(createProjectDto.startDate)
                    : undefined,
                endDate: createProjectDto.endDate
                    ? new Date(createProjectDto.endDate)
                    : undefined,
                budget: createProjectDto.budget,
                companyId: createProjectDto.companyId,
                userId,
            },
            include: {
                company: { select: { id: true, name: true, color: true } },
                _count: { select: { tasks: true } },
            },
        });
    }
    async findAllGrouped(userId) {
        const memberships = await this.prisma.companyMember.findMany({
            where: { userId },
            select: { companyId: true, role: true },
        });
        const memberCompanyIds = memberships.map((m) => m.companyId);
        const companies = await this.prisma.company.findMany({
            where: {
                OR: [{ userId }, { id: { in: memberCompanyIds } }],
            },
            include: {
                projects: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        _count: { select: { tasks: true } },
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
        return companies;
    }
    async findAll(userId, companyId) {
        const memberships = await this.prisma.companyMember.findMany({
            where: { userId },
            select: { companyId: true },
        });
        const memberCompanyIds = memberships.map((m) => m.companyId);
        return this.prisma.project.findMany({
            where: {
                ...(companyId ? { companyId } : {}),
                company: {
                    OR: [{ userId }, { id: { in: memberCompanyIds } }],
                },
            },
            include: {
                company: { select: { id: true, name: true, color: true } },
                _count: { select: { tasks: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const memberships = await this.prisma.companyMember.findMany({
            where: { userId },
            select: { companyId: true },
        });
        const memberCompanyIds = memberships.map((m) => m.companyId);
        const project = await this.prisma.project.findFirst({
            where: {
                id,
                company: {
                    OR: [{ userId }, { id: { in: memberCompanyIds } }],
                },
            },
            include: {
                company: { select: { id: true, name: true, color: true } },
                tasks: { orderBy: { createdAt: 'desc' } },
                _count: { select: { tasks: true } },
            },
        });
        if (!project) {
            throw new common_1.NotFoundException('Projeto não encontrado');
        }
        return project;
    }
    async update(id, updateProjectDto, userId) {
        const project = await this.prisma.project.findFirst({
            where: { id, userId },
        });
        if (!project) {
            throw new common_1.ForbiddenException('Sem permissão para editar este projeto');
        }
        return this.prisma.project.update({
            where: { id },
            data: {
                ...updateProjectDto,
                startDate: updateProjectDto.startDate
                    ? new Date(updateProjectDto.startDate)
                    : undefined,
                endDate: updateProjectDto.endDate
                    ? new Date(updateProjectDto.endDate)
                    : undefined,
            },
            include: {
                company: { select: { id: true, name: true, color: true } },
                _count: { select: { tasks: true } },
            },
        });
    }
    async remove(id, userId) {
        const project = await this.prisma.project.findFirst({
            where: { id, userId },
        });
        if (!project) {
            throw new common_1.ForbiddenException('Sem permissão para excluir este projeto');
        }
        return this.prisma.project.delete({ where: { id } });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map