import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';

@Injectable()
export class SprintsService {
  constructor(private prisma: PrismaService) {}

  private async verifyProjectAccess(projectId: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        company: {
          OR: [{ userId }, { members: { some: { userId } } }],
        },
      },
    });
    if (!project) throw new ForbiddenException('Sem acesso a este projeto');
    return project;
  }

  async create(dto: CreateSprintDto, userId: string) {
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

  async findByProject(projectId: string, userId: string) {
    await this.verifyProjectAccess(projectId, userId);
    return this.prisma.sprint.findMany({
      where: { projectId },
      include: { _count: { select: { tasks: true } } },
      orderBy: [{ isActive: 'desc' }, { startDate: 'desc' }],
    });
  }

  async update(id: string, dto: UpdateSprintDto, userId: string) {
    const sprint = await this.prisma.sprint.findFirst({
      where: { id },
      include: { project: true },
    });
    if (!sprint) throw new NotFoundException('Sprint não encontrada');
    await this.verifyProjectAccess(sprint.projectId, userId);

    // If activating this sprint, deactivate others in same project
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

  async remove(id: string, userId: string) {
    const sprint = await this.prisma.sprint.findFirst({ where: { id } });
    if (!sprint) throw new NotFoundException('Sprint não encontrada');
    await this.verifyProjectAccess(sprint.projectId, userId);
    return this.prisma.sprint.delete({ where: { id } });
  }
}
