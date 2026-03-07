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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let CompaniesService = class CompaniesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCompanyDto, userId) {
        const ownerMemberships = await this.prisma.companyMember.count({
            where: { userId, role: 'OWNER' },
        });
        if (ownerMemberships === 0) {
            throw new common_1.ForbiddenException('Membros convidados não podem criar empresas');
        }
        return this.prisma.company.create({
            data: {
                ...createCompanyDto,
                userId,
            },
        });
    }
    async findAll(userId) {
        const memberships = await this.prisma.companyMember.findMany({
            where: { userId },
            select: { companyId: true, role: true },
        });
        const memberCompanyIds = memberships.map((m) => m.companyId);
        const roleMap = new Map(memberships.map((m) => [m.companyId, m.role]));
        const companies = await this.prisma.company.findMany({
            where: {
                OR: [
                    { userId },
                    { id: { in: memberCompanyIds } },
                ],
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
                projects: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                    },
                },
                members: {
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                    },
                },
                _count: {
                    select: {
                        projects: true,
                        members: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return companies.map((company) => ({
            ...company,
            myRole: company.userId === userId
                ? 'OWNER'
                : (roleMap.get(company.id) ?? 'MEMBER'),
        }));
    }
    async findOne(id, userId) {
        const company = await this.prisma.company.findFirst({
            where: {
                id,
                OR: [
                    { userId },
                    { members: { some: { userId } } },
                ],
            },
            include: {
                members: {
                    include: {
                        user: { select: { id: true, name: true, email: true } },
                    },
                },
                projects: {
                    include: {
                        _count: {
                            select: {
                                tasks: true,
                            },
                        },
                    },
                },
            },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        return company;
    }
    async update(id, updateCompanyDto, userId) {
        const company = await this.prisma.company.findFirst({
            where: { id, userId },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        return this.prisma.company.update({
            where: { id },
            data: updateCompanyDto,
        });
    }
    async remove(id, userId) {
        const company = await this.prisma.company.findFirst({
            where: { id, userId },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        return this.prisma.company.delete({
            where: { id },
        });
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map