import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, userId: string) {
    // Verify user has access to the company (owner or member)
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
      throw new ForbiddenException('Sem acesso a esta empresa');
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

  // Returns all projects grouped by company accessible to the user
  async findAllGrouped(userId: string) {
    // Fetch companies accessible to user
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

  async findAll(userId: string, companyId?: string) {
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

  async findOne(id: string, userId: string) {
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
      throw new NotFoundException('Projeto não encontrado');
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string) {
    // Only owner of company or project creator can edit
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new ForbiddenException('Sem permissão para editar este projeto');
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

  async remove(id: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      throw new ForbiddenException('Sem permissão para excluir este projeto');
    }

    return this.prisma.project.delete({ where: { id } });
  }
}
