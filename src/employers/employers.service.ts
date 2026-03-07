import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
  CreatePositionDto,
  UpdatePositionDto,
  CreateEmployerDto,
  UpdateEmployerDto,
  CreateSkillDto,
  AssignRoleDto,
} from './dto/employer.dto';

const EMPLOYER_INCLUDE = {
  department: { select: { id: true, name: true } },
  position: { select: { id: true, name: true, level: true } },
  manager: { select: { id: true, fullName: true, emailCorporate: true } },
  user: { select: { id: true, name: true, email: true } },
  roles: true,
  skills: true,
  _count: { select: { reports: true } },
};

@Injectable()
export class EmployersService {
  constructor(private prisma: PrismaService) {}

  // ── Access helpers ──────────────────────────────────────────────────────────

  private async assertAccess(companyId: string, userId: string) {
    const company = await this.prisma.company.findFirst({
      where: {
        id: companyId,
        OR: [
          { userId },
          { members: { some: { userId } } },
        ],
      },
    });
    if (!company) throw new ForbiddenException('No access to this company');
    return company;
  }

  private async assertOwner(companyId: string, userId: string) {
    const company = await this.prisma.company.findFirst({
      where: { id: companyId, userId },
    });
    if (!company) throw new ForbiddenException('Only the company owner can perform this action');
    return company;
  }

  // ── Companies helper ────────────────────────────────────────────────────────

  async getAccessibleCompanies(userId: string) {
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

  // ── Departments ─────────────────────────────────────────────────────────────

  async getDepartments(companyId: string, userId: string) {
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

  async createDepartment(companyId: string, dto: CreateDepartmentDto, userId: string) {
    await this.assertOwner(companyId, userId);
    return this.prisma.department.create({
      data: { ...dto, companyId },
      include: {
        parent: { select: { id: true, name: true } },
        _count: { select: { employers: true } },
      },
    });
  }

  async updateDepartment(companyId: string, deptId: string, dto: UpdateDepartmentDto, userId: string) {
    await this.assertOwner(companyId, userId);
    const dept = await this.prisma.department.findFirst({ where: { id: deptId, companyId } });
    if (!dept) throw new NotFoundException('Department not found');
    return this.prisma.department.update({ where: { id: deptId }, data: dto });
  }

  async deleteDepartment(companyId: string, deptId: string, userId: string) {
    await this.assertOwner(companyId, userId);
    const dept = await this.prisma.department.findFirst({ where: { id: deptId, companyId } });
    if (!dept) throw new NotFoundException('Department not found');
    return this.prisma.department.delete({ where: { id: deptId } });
  }

  // ── Positions ───────────────────────────────────────────────────────────────

  async getPositions(companyId: string, userId: string) {
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

  async createPosition(companyId: string, dto: CreatePositionDto, userId: string) {
    await this.assertOwner(companyId, userId);
    return this.prisma.position.create({
      data: { ...dto, companyId },
      include: { department: { select: { id: true, name: true } } },
    });
  }

  async updatePosition(companyId: string, posId: string, dto: UpdatePositionDto, userId: string) {
    await this.assertOwner(companyId, userId);
    const pos = await this.prisma.position.findFirst({ where: { id: posId, companyId } });
    if (!pos) throw new NotFoundException('Position not found');
    return this.prisma.position.update({ where: { id: posId }, data: dto });
  }

  async deletePosition(companyId: string, posId: string, userId: string) {
    await this.assertOwner(companyId, userId);
    const pos = await this.prisma.position.findFirst({ where: { id: posId, companyId } });
    if (!pos) throw new NotFoundException('Position not found');
    return this.prisma.position.delete({ where: { id: posId } });
  }

  // ── Members + Profiles ──────────────────────────────────────────────────────

  /** Returns ALL company members, each with their employer profile (or null). */
  async listMembers(
    companyId: string,
    userId: string,
    filters: { departmentId?: string; status?: string; contractType?: string; search?: string },
  ) {
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
        ...(filters.status ? { status: filters.status as any } : {}),
        ...(filters.contractType ? { contractType: filters.contractType as any } : {}),
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

  /** Returns or auto-creates an employer profile for a company member. */
  async getOrCreateProfile(companyId: string, memberUserId: string, requestingUserId: string) {
    await this.assertAccess(companyId, requestingUserId);

    const member = await this.prisma.companyMember.findFirst({
      where: { companyId, userId: memberUserId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!member) throw new NotFoundException('Member not found in this company');

    const existing = await this.prisma.employer.findFirst({
      where: { companyId, userId: memberUserId },
      include: {
        ...EMPLOYER_INCLUDE,
        reports: { select: { id: true, fullName: true } },
      },
    });
    if (existing) return existing;

    return this.prisma.employer.create({
      data: {
        companyId,
        userId: memberUserId,
        fullName: member.user.name,
        emailCorporate: member.user.email,
        status: 'ACTIVE' as any,
        admissionDate: new Date(),
      },
      include: {
        ...EMPLOYER_INCLUDE,
        reports: { select: { id: true, fullName: true } },
      },
    });
  }

  // ── Employers (kept for direct CRUD) ────────────────────────────────────────

  async listEmployers(
    companyId: string,
    userId: string,
    filters: { departmentId?: string; status?: string; contractType?: string; search?: string },
  ) {
    await this.assertAccess(companyId, userId);
    return this.prisma.employer.findMany({
      where: {
        companyId,
        ...(filters.departmentId ? { departmentId: filters.departmentId } : {}),
        ...(filters.status ? { status: filters.status as any } : {}),
        ...(filters.contractType ? { contractType: filters.contractType as any } : {}),
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

  async getEmployer(companyId: string, employerId: string, userId: string) {
    await this.assertAccess(companyId, userId);
    const employer = await this.prisma.employer.findFirst({
      where: { id: employerId, companyId },
      include: {
        ...EMPLOYER_INCLUDE,
        reports: { select: { id: true, fullName: true, emailCorporate: true } },
      },
    });
    if (!employer) throw new NotFoundException('Employer not found');
    return employer;
  }

  async createEmployer(companyId: string, dto: CreateEmployerDto, userId: string) {
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

  async updateEmployer(companyId: string, employerId: string, dto: UpdateEmployerDto, userId: string) {
    await this.assertAccess(companyId, userId);
    const employer = await this.prisma.employer.findFirst({ where: { id: employerId, companyId } });
    if (!employer) throw new NotFoundException('Employer not found');
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

  async deleteEmployer(companyId: string, employerId: string, userId: string) {
    await this.assertOwner(companyId, userId);
    const employer = await this.prisma.employer.findFirst({ where: { id: employerId, companyId } });
    if (!employer) throw new NotFoundException('Employer not found');
    return this.prisma.employer.delete({ where: { id: employerId } });
  }

  // ── Skills ──────────────────────────────────────────────────────────────────

  async addSkill(companyId: string, employerId: string, dto: CreateSkillDto, userId: string) {
    await this.assertAccess(companyId, userId);
    const employer = await this.prisma.employer.findFirst({ where: { id: employerId, companyId } });
    if (!employer) throw new NotFoundException('Employer not found');
    return this.prisma.employerSkill.create({ data: { ...dto, employerId } });
  }

  async removeSkill(companyId: string, employerId: string, skillId: string, userId: string) {
    await this.assertAccess(companyId, userId);
    const skill = await this.prisma.employerSkill.findFirst({
      where: { id: skillId, employerId },
    });
    if (!skill) throw new NotFoundException('Skill not found');
    return this.prisma.employerSkill.delete({ where: { id: skillId } });
  }

  // ── Roles ───────────────────────────────────────────────────────────────────

  async assignRole(companyId: string, employerId: string, dto: AssignRoleDto, userId: string) {
    await this.assertOwner(companyId, userId);
    // Revoke existing same role if any
    await this.prisma.employerRole.updateMany({
      where: { employerId, companyId, revokedAt: null, role: dto.role },
      data: { revokedAt: new Date() },
    });
    return this.prisma.employerRole.create({
      data: { employerId, companyId, role: dto.role, grantedBy: userId },
    });
  }

  async revokeRole(companyId: string, employerId: string, roleId: string, userId: string) {
    await this.assertOwner(companyId, userId);
    return this.prisma.employerRole.update({
      where: { id: roleId },
      data: { revokedAt: new Date() },
    });
  }
}
