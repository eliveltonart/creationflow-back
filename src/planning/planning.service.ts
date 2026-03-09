import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreatePlanningDto,
  UpdatePlanningDto,
  AddPlanningTaskDto,
  UpdatePlanningTaskDto,
  CastVoteDto,
  CreateRiteDto,
  CreateIntruderDto,
  CreateAbsenceDto,
  CommitParticipantDto,
  AddParticipantDto,
  ResetVotesDto,
} from './dto/planning.dto';

@Injectable()
export class PlanningService {
  constructor(private prisma: PrismaService) {}

  // ── Access guard ───────────────────────────────────────────────────────────
  private async assertProjectAccess(projectId: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        company: {
          OR: [{ userId }, { members: { some: { userId } } }],
        },
      },
    });
    if (!project) throw new ForbiddenException('Sem acesso a este projeto.');
    return project;
  }

  private async assertNotCompleted(planningId: string) {
    const p = await this.prisma.planning.findUnique({ where: { id: planningId } });
    if (!p) throw new NotFoundException('Planning não encontrada.');
    if (p.status === 'COMPLETED' || p.status === 'ARCHIVED') {
      throw new ForbiddenException('Esta planning está finalizada e não pode ser editada.');
    }
    return p;
  }

  private planningInclude = {
    sprint: { select: { id: true, name: true, startDate: true, endDate: true, isActive: true } },
    facilitator: { select: { id: true, fullName: true } },
    createdBy: { select: { id: true, name: true, email: true } },
    participants: {
      include: { employer: { select: { id: true, fullName: true } } },
    },
    tasks: {
      include: {
        task: { select: { id: true, title: true, type: true, status: true, priority: true, storyPoints: true } },
        assignee: { select: { id: true, fullName: true } },
        votes: { include: { voter: { select: { id: true, fullName: true } } } },
      },
    },
    capacity: true,
    rites: true,
    intruders: true,
    absences: {
      include: { employer: { select: { id: true, fullName: true } } },
    },
    _count: { select: { participants: true, tasks: true } },
  };

  // ── CRUD ───────────────────────────────────────────────────────────────────
  async create(dto: CreatePlanningDto, userId: string) {
    await this.assertProjectAccess(dto.projectId, userId);

    const sprint = await this.prisma.sprint.findFirst({
      where: { id: dto.sprintId, projectId: dto.projectId },
    });
    if (!sprint) throw new NotFoundException('Sprint não encontrada neste projeto.');

    const planning = await this.prisma.planning.create({
      data: {
        name: dto.name,
        projectId: dto.projectId,
        sprintId: dto.sprintId,
        facilitatorId: dto.facilitatorId,
        createdById: userId,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
        durationMinutes: dto.durationMinutes,
        notes: dto.notes,
        participants: {
          create: dto.participantIds.map((employerId) => ({ employerId })),
        },
      },
      include: this.planningInclude,
    });

    // Initialize capacity record
    await this.prisma.planningCapacity.create({
      data: { planningId: planning.id },
    });

    return planning;
  }

  async findByProject(projectId: string, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    return this.prisma.planning.findMany({
      where: { projectId },
      include: {
        sprint: { select: { id: true, name: true, startDate: true, endDate: true } },
        facilitator: { select: { id: true, fullName: true } },
        capacity: true,
        _count: { select: { participants: true, tasks: true } },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(projectId: string, id: string, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    const planning = await this.prisma.planning.findFirst({
      where: { id, projectId },
      include: this.planningInclude,
    });
    if (!planning) throw new NotFoundException('Planning não encontrada.');
    return planning;
  }

  async update(projectId: string, id: string, dto: UpdatePlanningDto, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    const planning = await this.assertNotCompleted(id);
    if (planning.projectId !== projectId) throw new NotFoundException('Planning não encontrada.');

    return this.prisma.planning.update({
      where: { id },
      data: {
        ...dto,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      },
      include: this.planningInclude,
    });
  }

  async remove(projectId: string, id: string, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    const planning = await this.prisma.planning.findFirst({ where: { id, projectId } });
    if (!planning) throw new NotFoundException('Planning não encontrada.');
    if (planning.status !== 'DRAFT') {
      throw new ForbiddenException('Apenas plannings em rascunho podem ser excluídas.');
    }
    await this.prisma.planning.delete({ where: { id } });
    return { message: 'Planning removida com sucesso.' };
  }

  // ── Status transitions ─────────────────────────────────────────────────────
  async start(projectId: string, id: string, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    const planning = await this.prisma.planning.findFirst({ where: { id, projectId } });
    if (!planning) throw new NotFoundException('Planning não encontrada.');
    if (planning.status !== 'DRAFT') throw new BadRequestException('Planning já foi iniciada.');

    return this.prisma.planning.update({
      where: { id },
      data: { status: 'IN_PROGRESS', startedAt: new Date() },
      include: this.planningInclude,
    });
  }

  async close(projectId: string, id: string, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    const planning = await this.prisma.planning.findFirst({
      where: { id, projectId },
      include: { tasks: true },
    });
    if (!planning) throw new NotFoundException('Planning não encontrada.');
    if (planning.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Apenas plannings em andamento podem ser fechadas.');
    }

    // Blocker: must have tasks
    if (planning.tasks.length === 0) {
      throw new BadRequestException('A planning precisa ter pelo menos uma tarefa.');
    }
    // Blocker: all tasks must have SP and assignee
    const unestimated = planning.tasks.filter((t) => !t.storyPointsFinal || !t.assigneeId);
    if (unestimated.length > 0) {
      throw new BadRequestException(
        `${unestimated.length} tarefa(s) sem estimativa de SP ou responsável.`,
      );
    }

    return this.prisma.planning.update({
      where: { id },
      data: { status: 'COMPLETED', completedAt: new Date() },
      include: this.planningInclude,
    });
  }

  async advanceStep(projectId: string, id: string, step: number, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    const planning = await this.assertNotCompleted(id);
    if (planning.projectId !== projectId) throw new NotFoundException('Planning não encontrada.');
    if (planning.status !== 'IN_PROGRESS') throw new BadRequestException('Inicie a planning antes de avançar etapas.');
    if (step < 1 || step > 7) throw new BadRequestException('Etapa inválida (1-7).');

    return this.prisma.planning.update({
      where: { id },
      data: { currentStep: step },
      include: this.planningInclude,
    });
  }

  // ── Tasks ──────────────────────────────────────────────────────────────────
  async addTask(projectId: string, planningId: string, dto: AddPlanningTaskDto, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    await this.assertNotCompleted(planningId);

    const task = await this.prisma.task.findFirst({ where: { id: dto.taskId, projectId } });
    if (!task) throw new NotFoundException('Tarefa não encontrada neste projeto.');

    return this.prisma.planningTask.create({
      data: {
        planningId,
        taskId: dto.taskId,
        isDesignTask: dto.isDesignTask ?? false,
        handoffId: dto.handoffId,
      },
      include: {
        task: { select: { id: true, title: true, type: true, status: true, priority: true, storyPoints: true } },
        assignee: { select: { id: true, fullName: true } },
      },
    });
  }

  async updateTask(
    projectId: string,
    planningId: string,
    planningTaskId: string,
    dto: UpdatePlanningTaskDto,
    userId: string,
  ) {
    await this.assertProjectAccess(projectId, userId);
    await this.assertNotCompleted(planningId);

    return this.prisma.planningTask.update({
      where: { id: planningTaskId },
      data: dto,
      include: {
        task: { select: { id: true, title: true, type: true, status: true, priority: true } },
        assignee: { select: { id: true, fullName: true } },
        votes: { include: { voter: { select: { id: true, fullName: true } } } },
      },
    });
  }

  async removeTask(projectId: string, planningId: string, planningTaskId: string, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    await this.assertNotCompleted(planningId);
    await this.prisma.planningTask.delete({ where: { id: planningTaskId } });
    return { message: 'Tarefa removida da planning.' };
  }

  // ── Votes ──────────────────────────────────────────────────────────────────
  async castVote(projectId: string, planningId: string, dto: CastVoteDto, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    await this.assertNotCompleted(planningId);

    const round = dto.round ?? 1;

    return this.prisma.planningVote.upsert({
      where: {
        planningId_taskId_voterId_round: {
          planningId,
          taskId: dto.planningTaskId,
          voterId: dto.voterId,
          round,
        },
      },
      update: { voteValue: dto.voteValue, votedAt: new Date() },
      create: {
        planningId,
        taskId: dto.planningTaskId,
        voterId: dto.voterId,
        voteValue: dto.voteValue,
        round,
      },
      include: { voter: { select: { id: true, fullName: true } } },
    });
  }

  async getVotes(projectId: string, planningId: string, planningTaskId: string, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    return this.prisma.planningVote.findMany({
      where: { planningId, taskId: planningTaskId },
      include: { voter: { select: { id: true, fullName: true } } },
      orderBy: [{ round: 'asc' }, { votedAt: 'asc' }],
    });
  }

  async resetVotes(projectId: string, planningId: string, dto: ResetVotesDto, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    await this.assertNotCompleted(planningId);

    const latest = await this.prisma.planningVote.findFirst({
      where: { planningId, taskId: dto.planningTaskId },
      orderBy: { round: 'desc' },
    });
    const nextRound = (latest?.round ?? 0) + 1;

    return { message: 'Nova rodada iniciada.', round: nextRound };
  }

  // ── Capacity: Rites ────────────────────────────────────────────────────────
  async addRite(projectId: string, planningId: string, dto: CreateRiteDto, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    await this.assertNotCompleted(planningId);

    const totalHours = (dto.frequencyPerSprint * dto.durationMinutes * dto.participantsCount) / 60;

    const rite = await this.prisma.planningRite.create({
      data: { planningId, ...dto, totalHours },
    });

    await this.recalculateCapacity(planningId);
    return rite;
  }

  async removeRite(projectId: string, planningId: string, riteId: string, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    await this.assertNotCompleted(planningId);
    await this.prisma.planningRite.delete({ where: { id: riteId } });
    await this.recalculateCapacity(planningId);
    return { message: 'Rito removido.' };
  }

  // ── Capacity: Intruders ────────────────────────────────────────────────────
  async addIntruder(projectId: string, planningId: string, dto: CreateIntruderDto, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    await this.assertNotCompleted(planningId);

    const intruder = await this.prisma.planningIntruder.create({
      data: { planningId, ...dto },
    });

    await this.recalculateCapacity(planningId);
    return intruder;
  }

  async removeIntruder(projectId: string, planningId: string, intruderId: string, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    await this.assertNotCompleted(planningId);
    await this.prisma.planningIntruder.delete({ where: { id: intruderId } });
    await this.recalculateCapacity(planningId);
    return { message: 'Intruder removido.' };
  }

  // ── Capacity: Absences ─────────────────────────────────────────────────────
  async addAbsence(projectId: string, planningId: string, dto: CreateAbsenceDto, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    await this.assertNotCompleted(planningId);

    const absence = await this.prisma.planningAbsence.create({
      data: {
        planningId,
        employerId: dto.employerId,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        reason: dto.reason,
        hours: dto.hours,
      },
      include: { employer: { select: { id: true, fullName: true } } },
    });

    await this.recalculateCapacity(planningId);
    return absence;
  }

  async removeAbsence(projectId: string, planningId: string, absenceId: string, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    await this.assertNotCompleted(planningId);
    await this.prisma.planningAbsence.delete({ where: { id: absenceId } });
    await this.recalculateCapacity(planningId);
    return { message: 'Ausência removida.' };
  }

  // ── Capacity: auto-recalculate ─────────────────────────────────────────────
  private async recalculateCapacity(planningId: string) {
    const [rites, intruders, absences, tasks, planning] = await Promise.all([
      this.prisma.planningRite.findMany({ where: { planningId } }),
      this.prisma.planningIntruder.findMany({ where: { planningId } }),
      this.prisma.planningAbsence.findMany({ where: { planningId } }),
      this.prisma.planningTask.findMany({ where: { planningId } }),
      this.prisma.planning.findUnique({
        where: { id: planningId },
        include: {
          participants: true,
          sprint: true,
        },
      }),
    ]);

    if (!planning) return;

    const sprintDays = planning.sprint.startDate && planning.sprint.endDate
      ? Math.ceil(
          (planning.sprint.endDate.getTime() - planning.sprint.startDate.getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : 10;

    const workingDays = Math.ceil(sprintDays * (5 / 7));
    const participantCount = planning.participants.length;
    const totalHours = participantCount * 8 * workingDays;

    const ritesHours = rites.reduce((s, r) => s + r.totalHours, 0);
    const intrudersHours = intruders.reduce((s, i) => s + i.estimatedHours, 0);
    const absencesHours = absences.reduce((s, a) => s + a.hours, 0);
    const effectiveHours = Math.max(0, totalHours - ritesHours - intrudersHours - absencesHours);

    const committedSp = tasks.reduce((s, t) => s + (t.storyPointsFinal ?? 0), 0);
    const committedHours = tasks.reduce((s, t) => s + (t.hoursEstimated ?? 0), 0);

    await this.prisma.planningCapacity.upsert({
      where: { planningId },
      update: { totalHours, ritesHours, intrudersHours, absencesHours, effectiveHours, committedSp, committedHours },
      create: { planningId, totalHours, ritesHours, intrudersHours, absencesHours, effectiveHours, committedSp, committedHours },
    });
  }

  async getCapacity(projectId: string, planningId: string, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    await this.recalculateCapacity(planningId);
    return this.prisma.planningCapacity.findUnique({ where: { planningId } });
  }

  // ── Participants ───────────────────────────────────────────────────────────
  async addParticipant(projectId: string, planningId: string, dto: AddParticipantDto, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    await this.assertNotCompleted(planningId);

    return this.prisma.planningParticipant.create({
      data: { planningId, employerId: dto.employerId },
      include: { employer: { select: { id: true, fullName: true } } },
    });
  }

  async removeParticipant(projectId: string, planningId: string, participantId: string, userId: string) {
    await this.assertProjectAccess(projectId, userId);
    await this.assertNotCompleted(planningId);
    await this.prisma.planningParticipant.delete({ where: { id: participantId } });
    return { message: 'Participante removido.' };
  }

  async commitParticipant(projectId: string, planningId: string, dto: CommitParticipantDto, userId: string) {
    await this.assertProjectAccess(projectId, userId);

    const participant = await this.prisma.planningParticipant.findFirst({
      where: { planningId, employerId: dto.employerId },
    });
    if (!participant) throw new NotFoundException('Participante não encontrado nesta planning.');

    return this.prisma.planningParticipant.update({
      where: { id: participant.id },
      data: { committed: true, committedAt: new Date() },
      include: { employer: { select: { id: true, fullName: true } } },
    });
  }

  // ── Push to Sprint ─────────────────────────────────────────────────────────
  async pushToSprint(projectId: string, planningId: string, userId: string) {
    await this.assertProjectAccess(projectId, userId);

    const planning = await this.prisma.planning.findFirst({
      where: { id: planningId, projectId },
      include: { tasks: true, sprint: true },
    });
    if (!planning) throw new NotFoundException('Planning não encontrada.');
    if (planning.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Apenas plannings em andamento podem subir tarefas para a sprint.');
    }

    const unready = planning.tasks.filter((t) => !t.storyPointsFinal || !t.assigneeId);
    if (unready.length > 0) {
      throw new BadRequestException(`${unready.length} tarefa(s) sem estimativa ou responsável.`);
    }

    // Atomic update of all tasks in a transaction
    await this.prisma.$transaction(
      planning.tasks.map((pt) =>
        this.prisma.task.update({
          where: { id: pt.taskId },
          data: {
            sprintId: planning.sprintId,
            storyPoints: pt.storyPointsFinal,
            estimatedHours: pt.hoursEstimated,
            status: 'TODO',
          },
        }),
      ),
    );

    // Update sprint goal
    if (planning.sprintGoal) {
      await this.prisma.sprint.update({
        where: { id: planning.sprintId },
        data: { goal: planning.sprintGoal },
      });
    }

    return {
      message: `${planning.tasks.length} tarefa(s) enviadas para a sprint "${planning.sprint.name}" com sucesso.`,
      sprintId: planning.sprintId,
      tasksCount: planning.tasks.length,
    };
  }
}
