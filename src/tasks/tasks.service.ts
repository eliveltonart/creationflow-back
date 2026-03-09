import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';

// ── Include helpers ───────────────────────────────────────────────────────────

const TASK_INCLUDE = {
  sprint: { select: { id: true, name: true } },
  backlogItem: {
    select: {
      id: true,
      title: true,
      type: true,
      priority: true,
      status: true,
      storyPoints: true,
      epicId: true,
      epic: { select: { id: true, name: true, color: true } },
      refinementStatus: true,
      tags: true,
    },
  },
} as const;

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
        backlogItemId: dto.backlogItemId ?? null,
      },
      include: TASK_INCLUDE,
    });
  }

  async findByProject(projectId: string, userId: string) {
    await this.verifyProjectAccess(projectId, userId);
    const tasks = await this.prisma.task.findMany({
      where: { projectId },
      include: TASK_INCLUDE,
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
      include: TASK_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByBacklogItem(backlogItemId: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { backlogItemId },
      include: TASK_INCLUDE,
    });
    if (!task) throw new NotFoundException('Nenhuma tarefa vinculada a este item do backlog');
    await this.verifyProjectAccess(task.projectId, userId);
    return task;
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id },
      include: TASK_INCLUDE,
    });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    await this.verifyProjectAccess(task.projectId, userId);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, userId: string) {
    const task = await this.prisma.task.findFirst({ where: { id } });
    if (!task) throw new NotFoundException('Tarefa não encontrada');
    await this.verifyProjectAccess(task.projectId, userId);

    const updated = await this.prisma.task.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        sprintId: dto.sprintId !== undefined ? (dto.sprintId || null) : undefined,
        backlogItemId: dto.backlogItemId !== undefined ? (dto.backlogItemId || null) : undefined,
      },
      include: TASK_INCLUDE,
    });

    // Sync status back to BacklogItem when task status changes in kanban
    if (dto.status && updated.backlogItemId) {
      const backlogStatusMap: Record<string, string> = {
        [TaskStatus.TODO]: 'BACKLOG',
        [TaskStatus.IN_PROGRESS]: 'IN_SPRINT',
        [TaskStatus.IN_REVIEW]: 'IN_SPRINT',
        [TaskStatus.IN_DEPLOY]: 'IN_SPRINT',
        [TaskStatus.DONE]: 'DONE',
        [TaskStatus.BLOCKED]: 'IN_SPRINT',
      };
      const newBacklogStatus = backlogStatusMap[dto.status];
      if (newBacklogStatus) {
        await this.prisma.backlogItem.update({
          where: { id: updated.backlogItemId },
          data: { status: newBacklogStatus as any },
        });
      }
    }

    return updated;
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
