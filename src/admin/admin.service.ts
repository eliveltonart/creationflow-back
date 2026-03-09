import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  AdminCreateUserDto,
  AdminUpdateUserDto,
  AdminSetFeatureFlagDto,
  AdminQueryDto,
} from './dto/admin.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ── Log helper ─────────────────────────────────────────────────────────────
  private async log(
    adminId: string,
    action: string,
    entity: string,
    entityId?: string,
    details?: any,
    ip?: string,
  ) {
    await this.prisma.adminLog.create({
      data: { adminId, action, entity, entityId, details, ip },
    });
  }

  // ── Platform stats ─────────────────────────────────────────────────────────
  async getPlatformStats() {
    const [
      totalUsers,
      activeUsers,
      superAdmins,
      totalCompanies,
      totalProjects,
      totalTasks,
      totalSprints,
      totalHandoffs,
      totalRetros,
      totalResources,
      totalInvites,
      recentUsers,
      tasksByStatus,
      projectsByStatus,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { isSuperAdmin: true } }),
      this.prisma.company.count(),
      this.prisma.project.count(),
      this.prisma.task.count(),
      this.prisma.sprint.count(),
      this.prisma.designHandoff.count(),
      this.prisma.retrospective.count(),
      this.prisma.resource.count(),
      this.prisma.invite.count(),
      this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, name: true, email: true, createdAt: true, isActive: true, isSuperAdmin: true },
      }),
      this.prisma.task.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      this.prisma.project.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
    ]);

    return {
      users: { total: totalUsers, active: activeUsers, superAdmins },
      companies: { total: totalCompanies },
      modules: {
        projects: { total: totalProjects, byStatus: projectsByStatus },
        tasks: { total: totalTasks, byStatus: tasksByStatus },
        sprints: { total: totalSprints },
        handoffs: { total: totalHandoffs },
        retros: { total: totalRetros },
        resources: { total: totalResources },
        invites: { total: totalInvites },
      },
      recentUsers,
    };
  }

  // ── Users ──────────────────────────────────────────────────────────────────
  async listUsers(query: AdminQueryDto) {
    const page = Math.max(1, parseInt(query.page ?? '1'));
    const limit = Math.min(100, parseInt(query.limit ?? '20'));
    const skip = (page - 1) * limit;

    const where = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' as const } },
            { email: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          isSuperAdmin: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              companies: true,
              projects: true,
              tasks: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        isSuperAdmin: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        companies: {
          select: { id: true, name: true, createdAt: true },
        },
        companyMembers: {
          include: { company: { select: { id: true, name: true } } },
        },
        featureFlags: true,
        _count: {
          select: {
            companies: true,
            projects: true,
            tasks: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }

  async createUser(dto: AdminCreateUserDto, adminId: string, ip?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException('Email já está em uso.');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        isSuperAdmin: dto.isSuperAdmin ?? false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isSuperAdmin: true,
        isActive: true,
        createdAt: true,
      },
    });

    await this.log(adminId, 'CREATE_USER', 'User', user.id, { email: user.email }, ip);
    return user;
  }

  async updateUser(id: string, dto: AdminUpdateUserDto, adminId: string, ip?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const data: any = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        isSuperAdmin: true,
        isActive: true,
        updatedAt: true,
      },
    });

    await this.log(adminId, 'UPDATE_USER', 'User', id, dto, ip);
    return updated;
  }

  async deleteUser(id: string, adminId: string, ip?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    await this.prisma.user.delete({ where: { id } });
    await this.log(adminId, 'DELETE_USER', 'User', id, { email: user.email }, ip);
    return { message: 'Usuário removido com sucesso.' };
  }

  // ── Feature Flags ──────────────────────────────────────────────────────────
  async setFeatureFlag(
    userId: string,
    dto: AdminSetFeatureFlagDto,
    adminId: string,
    ip?: string,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    const flag = await this.prisma.userFeatureFlag.upsert({
      where: { userId_feature: { userId, feature: dto.feature } },
      update: { enabled: dto.enabled },
      create: { userId, feature: dto.feature, enabled: dto.enabled },
    });

    await this.log(adminId, 'SET_FEATURE_FLAG', 'UserFeatureFlag', userId, dto, ip);
    return flag;
  }

  async getFeatureFlags(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    return this.prisma.userFeatureFlag.findMany({ where: { userId } });
  }

  // ── Companies ──────────────────────────────────────────────────────────────
  async listCompanies(query: AdminQueryDto) {
    const page = Math.max(1, parseInt(query.page ?? '1'));
    const limit = Math.min(100, parseInt(query.limit ?? '20'));
    const skip = (page - 1) * limit;

    const where = query.search
      ? { name: { contains: query.search, mode: 'insensitive' as const } }
      : {};

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          _count: {
            select: { members: true, projects: true },
          },
        },
      }),
      this.prisma.company.count({ where }),
    ]);

    return {
      data: companies,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async deleteCompany(id: string, adminId: string, ip?: string) {
    const company = await this.prisma.company.findUnique({ where: { id } });
    if (!company) throw new NotFoundException('Empresa não encontrada.');

    await this.prisma.company.delete({ where: { id } });
    await this.log(adminId, 'DELETE_COMPANY', 'Company', id, { name: company.name }, ip);
    return { message: 'Empresa removida com sucesso.' };
  }

  // ── Audit Logs ─────────────────────────────────────────────────────────────
  async getAdminLogs(query: AdminQueryDto) {
    const page = Math.max(1, parseInt(query.page ?? '1'));
    const limit = Math.min(100, parseInt(query.limit ?? '30'));
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.adminLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          admin: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.adminLog.count(),
    ]);

    return {
      data: logs,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }
}
