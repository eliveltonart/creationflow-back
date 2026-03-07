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
exports.EmployersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const EMPLOYER_INCLUDE = {
    department: { select: { id: true, name: true } },
    position: { select: { id: true, name: true, level: true } },
    manager: { select: { id: true, fullName: true, emailCorporate: true } },
    user: { select: { id: true, name: true, email: true } },
    roles: true,
    skills: true,
    _count: { select: { reports: true } },
};
let EmployersService = class EmployersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertAccess(companyId, userId) {
        const company = await this.prisma.company.findFirst({
            where: {
                id: companyId,
                OR: [
                    { userId },
                    { members: { some: { userId } } },
                ],
            },
        });
        if (!company)
            throw new common_1.ForbiddenException('No access to this company');
        return company;
    }
    async assertOwner(companyId, userId) {
        const company = await this.prisma.company.findFirst({
            where: { id: companyId, userId },
        });
        if (!company)
            throw new common_1.ForbiddenException('Only the company owner can perform this action');
        return company;
    }
    async getAccessibleCompanies(userId) {
        const memberships = await this.prisma.companyMember.findMany({
            where: { userId },
            select: { companyId: true },
        });
        const memberIds = memberships.map((m) => m.companyId);
        return this.prisma.company.findMany({
            where: { OR: [{ userId }, { id: { in: memberIds } }] },
            select: { id: true, name: true, color: true },
            orderBy: { name: 'asc' },
        });
    }
    async getDepartments(companyId, userId) {
        await this.assertAccess(companyId, userId);
        return this.prisma.department.findMany({
            where: { companyId },
            include: {
                parent: { select: { id: true, name: true } },
                children: { select: { id: true, name: true } },
                manager: { select: { id: true, fullName: true } },
                _count: { select: { employers: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async createDepartment(companyId, dto, userId) {
        await this.assertOwner(companyId, userId);
        return this.prisma.department.create({
            data: { ...dto, companyId },
            include: {
                parent: { select: { id: true, name: true } },
                _count: { select: { employers: true } },
            },
        });
    }
    async updateDepartment(companyId, deptId, dto, userId) {
        await this.assertOwner(companyId, userId);
        const dept = await this.prisma.department.findFirst({ where: { id: deptId, companyId } });
        if (!dept)
            throw new common_1.NotFoundException('Department not found');
        return this.prisma.department.update({ where: { id: deptId }, data: dto });
    }
    async deleteDepartment(companyId, deptId, userId) {
        await this.assertOwner(companyId, userId);
        const dept = await this.prisma.department.findFirst({ where: { id: deptId, companyId } });
        if (!dept)
            throw new common_1.NotFoundException('Department not found');
        return this.prisma.department.delete({ where: { id: deptId } });
    }
    async getPositions(companyId, userId) {
        await this.assertAccess(companyId, userId);
        return this.prisma.position.findMany({
            where: { companyId },
            include: {
                department: { select: { id: true, name: true } },
                _count: { select: { employers: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async createPosition(companyId, dto, userId) {
        await this.assertOwner(companyId, userId);
        return this.prisma.position.create({
            data: { ...dto, companyId },
            include: { department: { select: { id: true, name: true } } },
        });
    }
    async updatePosition(companyId, posId, dto, userId) {
        await this.assertOwner(companyId, userId);
        const pos = await this.prisma.position.findFirst({ where: { id: posId, companyId } });
        if (!pos)
            throw new common_1.NotFoundException('Position not found');
        return this.prisma.position.update({ where: { id: posId }, data: dto });
    }
    async deletePosition(companyId, posId, userId) {
        await this.assertOwner(companyId, userId);
        const pos = await this.prisma.position.findFirst({ where: { id: posId, companyId } });
        if (!pos)
            throw new common_1.NotFoundException('Position not found');
        return this.prisma.position.delete({ where: { id: posId } });
    }
    async listMembers(companyId, userId, filters) {
        await this.assertAccess(companyId, userId);
        const members = await this.prisma.companyMember.findMany({
            where: {
                companyId,
                ...(filters.search
                    ? { user: { name: { contains: filters.search, mode: 'insensitive' } } }
                    : {}),
            },
            include: { user: { select: { id: true, name: true, email: true } } },
            orderBy: { user: { name: 'asc' } },
        });
        const userIds = members.map((m) => m.userId);
        const profiles = await this.prisma.employer.findMany({
            where: {
                companyId,
                userId: { in: userIds },
                ...(filters.departmentId ? { departmentId: filters.departmentId } : {}),
                ...(filters.status ? { status: filters.status } : {}),
                ...(filters.contractType ? { contractType: filters.contractType } : {}),
            },
            include: EMPLOYER_INCLUDE,
        });
        const profileMap = new Map(profiles.map((p) => [p.userId, p]));
        return members.map((member) => ({
            userId: member.userId,
            memberRole: member.role,
            user: member.user,
            profile: profileMap.get(member.userId) ?? null,
        }));
    }
    async getOrCreateProfile(companyId, memberUserId, requestingUserId) {
        await this.assertAccess(companyId, requestingUserId);
        const member = await this.prisma.companyMember.findFirst({
            where: { companyId, userId: memberUserId },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found in this company');
        const existing = await this.prisma.employer.findFirst({
            where: { companyId, userId: memberUserId },
            include: {
                ...EMPLOYER_INCLUDE,
                reports: { select: { id: true, fullName: true } },
            },
        });
        if (existing)
            return existing;
        return this.prisma.employer.create({
            data: {
                companyId,
                userId: memberUserId,
                fullName: member.user.name,
                emailCorporate: member.user.email,
                status: 'ACTIVE',
                admissionDate: new Date(),
            },
            include: {
                ...EMPLOYER_INCLUDE,
                reports: { select: { id: true, fullName: true } },
            },
        });
    }
    async listEmployers(companyId, userId, filters) {
        await this.assertAccess(companyId, userId);
        return this.prisma.employer.findMany({
            where: {
                companyId,
                ...(filters.departmentId ? { departmentId: filters.departmentId } : {}),
                ...(filters.status ? { status: filters.status } : {}),
                ...(filters.contractType ? { contractType: filters.contractType } : {}),
                ...(filters.search
                    ? {
                        OR: [
                            { fullName: { contains: filters.search, mode: 'insensitive' } },
                            { emailCorporate: { contains: filters.search, mode: 'insensitive' } },
                        ],
                    }
                    : {}),
            },
            include: EMPLOYER_INCLUDE,
            orderBy: { fullName: 'asc' },
        });
    }
    async getEmployer(companyId, employerId, userId) {
        await this.assertAccess(companyId, userId);
        const employer = await this.prisma.employer.findFirst({
            where: { id: employerId, companyId },
            include: {
                ...EMPLOYER_INCLUDE,
                reports: { select: { id: true, fullName: true, emailCorporate: true } },
            },
        });
        if (!employer)
            throw new common_1.NotFoundException('Employer not found');
        return employer;
    }
    async createEmployer(companyId, dto, userId) {
        await this.assertAccess(companyId, userId);
        const { admissionDate, birthDate, terminationDate, ...rest } = dto;
        return this.prisma.employer.create({
            data: {
                ...rest,
                companyId,
                admissionDate: admissionDate ? new Date(admissionDate) : new Date(),
                birthDate: birthDate ? new Date(birthDate) : undefined,
                terminationDate: terminationDate ? new Date(terminationDate) : undefined,
            },
            include: EMPLOYER_INCLUDE,
        });
    }
    async updateEmployer(companyId, employerId, dto, userId) {
        await this.assertAccess(companyId, userId);
        const employer = await this.prisma.employer.findFirst({ where: { id: employerId, companyId } });
        if (!employer)
            throw new common_1.NotFoundException('Employer not found');
        const { admissionDate, birthDate, terminationDate, ...rest } = dto;
        return this.prisma.employer.update({
            where: { id: employerId },
            data: {
                ...rest,
                ...(admissionDate ? { admissionDate: new Date(admissionDate) } : {}),
                ...(birthDate ? { birthDate: new Date(birthDate) } : {}),
                ...(terminationDate ? { terminationDate: new Date(terminationDate) } : {}),
            },
            include: EMPLOYER_INCLUDE,
        });
    }
    async deleteEmployer(companyId, employerId, userId) {
        await this.assertOwner(companyId, userId);
        const employer = await this.prisma.employer.findFirst({ where: { id: employerId, companyId } });
        if (!employer)
            throw new common_1.NotFoundException('Employer not found');
        return this.prisma.employer.delete({ where: { id: employerId } });
    }
    async addSkill(companyId, employerId, dto, userId) {
        await this.assertAccess(companyId, userId);
        const employer = await this.prisma.employer.findFirst({ where: { id: employerId, companyId } });
        if (!employer)
            throw new common_1.NotFoundException('Employer not found');
        return this.prisma.employerSkill.create({ data: { ...dto, employerId } });
    }
    async removeSkill(companyId, employerId, skillId, userId) {
        await this.assertAccess(companyId, userId);
        const skill = await this.prisma.employerSkill.findFirst({
            where: { id: skillId, employerId },
        });
        if (!skill)
            throw new common_1.NotFoundException('Skill not found');
        return this.prisma.employerSkill.delete({ where: { id: skillId } });
    }
    async assignRole(companyId, employerId, dto, userId) {
        await this.assertOwner(companyId, userId);
        await this.prisma.employerRole.updateMany({
            where: { employerId, companyId, revokedAt: null, role: dto.role },
            data: { revokedAt: new Date() },
        });
        return this.prisma.employerRole.create({
            data: { employerId, companyId, role: dto.role, grantedBy: userId },
        });
    }
    async revokeRole(companyId, employerId, roleId, userId) {
        await this.assertOwner(companyId, userId);
        return this.prisma.employerRole.update({
            where: { id: roleId },
            data: { revokedAt: new Date() },
        });
    }
};
exports.EmployersService = EmployersService;
exports.EmployersService = EmployersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EmployersService);
//# sourceMappingURL=employers.service.js.map