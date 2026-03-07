import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class TasksService {
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

  async create(dto: CreateTaskDto, userId: string) {
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

  async findByProject(projectId: string, userId: string) {
    await this.verifyProjectAccess(projectId, userId);
    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      include: { sprint: { select: { id: true, name: true } } },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });

    // Group by status for kanban
    const grouped: Record<string, typeof tasks> = {};
    for (const s of Object.values(TaskStatus)) grouped[s] = [];
    for (const t of tasks) grouped[t.status].push(t);
    return grouped;
  }

  async findBySprint(sprintId: string, userId: string) {
    const sprint = await this.prisma.sprint.findFirst({ where: { id: sprintId } });
    if (!sprint) throw new NotFoundException('Sprint não encontrada');
    await this.verifyProjectAccess(sprint.projectId, userId);
    return this.prisma.task.findMany({
      where: { sprintId },
      include: { sprint: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id },
      include: { sprint: { select: { id: true, name: true } } },
    });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    await this.verifyProjectAccess(task.projectId, userId);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, userId: string) {
    const task = await this.prisma.task.findFirst({ where: { id } });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
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

  async updateDodItem(id: string, index: number, completed: boolean, userId: string) {
    const task = await this.findOne(id, userId);
    const dod = (task.dod as { text: string; completed: boolean }[]) ?? [];
    if (index < 0 || index >= dod.length) throw new NotFoundException('Item DoD não encontrado');
    dod[index].completed = completed;
    return this.prisma.task.update({ where: { id }, data: { dod } });
  }

  async remove(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({ where: { id } });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    await this.verifyProjectAccess(task.projectId, userId);
    return this.prisma.task.delete({ where: { id } });
  }
}
