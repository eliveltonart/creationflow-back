import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateRetroDto,
  UpdateRetroDto,
  CreateCardDto,
  UpdateCardDto,
  VoteCardDto,
  CreateActionDto,
  JoinRetroDto,
  RetroStatus,
} from './dto/retro.dto';

const RETRO_INCLUDE = {
  project: { select: { id: true, name: true, companyId: true } },
  facilitator: { select: { id: true, name: true, email: true } },
  sprint: { select: { id: true, name: true } },
  task: { select: { id: true, title: true } },
  cards: {
    include: {
      author: { select: { id: true, name: true, email: true } },
      votes: true,
      actions: { select: { id: true, title: true } },
    },
    orderBy: { createdAt: 'asc' as const },
  },
  actions: {
    include: {
      card: { select: { id: true, content: true, category: true } },
      assignee: { select: { id: true, name: true, email: true } },
      task: { select: { id: true, title: true, status: true } },
    },
    orderBy: { createdAt: 'asc' as const },
  },
  participants: {
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
  },
  _count: { select: { cards: true, actions: true, participants: true } },
};

const STATUS_ORDER: RetroStatus[] = [
  RetroStatus.DRAFT,
  RetroStatus.COLECT,
  RetroStatus.VOTE,
  RetroStatus.ACT,
  RetroStatus.CLOSED,
];

@Injectable()
export class RetroService {
  constructor(private prisma: PrismaService) {}

  private async assertFacilitator(retroId: string, userId: string) {
    const retro = await this.prisma.retrospective.findUnique({
      where: { id: retroId },
      include: { project: true },
    });
    if (!retro) throw new NotFoundException('Retro not found');

    const company = await this.prisma.company.findFirst({
      where: { id: retro.project.companyId, userId },
    });
    const member = await this.prisma.companyMember.findFirst({
      where: { companyId: retro.project.companyId, userId },
    });
    if (!company && !member) throw new ForbiddenException();
    return retro;
  }

  private async assertAccess(retroId: string, userId: string) {
    return this.assertFacilitator(retroId, userId);
  }

  // ── CRUD ─────────────────────────────────────────────────────────────────

  async create(dto: CreateRetroDto, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: dto.projectId } });
    if (!project) throw new NotFoundException('Project not found');

    const company = await this.prisma.company.findFirst({
      where: { id: project.companyId, userId },
    });
    const member = await this.prisma.companyMember.findFirst({
      where: { companyId: project.companyId, userId },
    });
    if (!company && !member) throw new ForbiddenException();

    if (dto.sprintId && dto.taskId) {
      throw new BadRequestException('A retro cannot be linked to both a sprint and a task');
    }

    const retro = await this.prisma.retrospective.create({
      data: {
        title: dto.title,
        description: dto.description,
        projectId: dto.projectId,
        facilitatorId: userId,
        sprintId: dto.sprintId,
        taskId: dto.taskId,
        isAnonymous: dto.isAnonymous ?? false,
        voteLimit: dto.voteLimit ?? 5,
        col1Name: dto.col1Name ?? 'Went Well',
        col1Color: dto.col1Color ?? '#22c55e',
        col2Name: dto.col2Name ?? 'Needs Improvement',
        col2Color: dto.col2Color ?? '#f97316',
        col3Name: dto.col3Name ?? 'Action Items',
        col3Color: dto.col3Color ?? '#3b82f6',
      },
      include: RETRO_INCLUDE,
    });

    // Auto-join facilitator as participant
    await this.prisma.retroParticipant.create({
      data: { retroId: retro.id, userId, name: '' },
    });

    return retro;
  }

  async findAll(userId: string, projectId?: string, status?: string) {
    const owned = await this.prisma.company.findMany({ where: { userId }, select: { id: true } });
    const membered = await this.prisma.companyMember.findMany({ where: { userId }, select: { companyId: true } });
    const companyIds = [...owned.map((c) => c.id), ...membered.map((m) => m.companyId)];

    return this.prisma.retrospective.findMany({
      where: {
        project: { companyId: { in: companyIds } },
        ...(projectId ? { projectId } : {}),
        ...(status ? { status: status as RetroStatus } : {}),
      },
      include: RETRO_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByShareToken(token: string) {
    const retro = await this.prisma.retrospective.findUnique({
      where: { shareToken: token },
      include: RETRO_INCLUDE,
    });
    if (!retro) throw new NotFoundException('Retro not found');
    return retro;
  }

  async findOne(id: string, userId: string) {
    await this.assertAccess(id, userId);
    return this.prisma.retrospective.findUnique({ where: { id }, include: RETRO_INCLUDE });
  }

  async update(id: string, dto: UpdateRetroDto, userId: string) {
    const retro = await this.assertFacilitator(id, userId);
    if (retro.isLocked) throw new ForbiddenException('Retro is closed');
    return this.prisma.retrospective.update({ where: { id }, data: dto, include: RETRO_INCLUDE });
  }

  async delete(id: string, userId: string) {
    await this.assertFacilitator(id, userId);
    return this.prisma.retrospective.delete({ where: { id } });
  }

  async revokeShareToken(id: string, userId: string) {
    await this.assertFacilitator(id, userId);
    return this.prisma.retrospective.update({
      where: { id },
      data: { shareToken: Math.random().toString(36).slice(2) + Date.now().toString(36) },
    });
  }

  // ── Phase ────────────────────────────────────────────────────────────────

  async advancePhase(id: string, userId: string) {
    const retro = await this.assertFacilitator(id, userId);
    if (retro.isLocked) throw new ForbiddenException('Retro is closed');

    const currentIdx = STATUS_ORDER.indexOf(retro.status as RetroStatus);
    if (currentIdx === STATUS_ORDER.length - 1) throw new BadRequestException('Already at final phase');

    const nextStatus = STATUS_ORDER[currentIdx + 1];
    const isClosing = nextStatus === RetroStatus.CLOSED;

    return this.prisma.retrospective.update({
      where: { id },
      data: {
        status: nextStatus,
        isLocked: isClosing,
        closedAt: isClosing ? new Date() : undefined,
      },
      include: RETRO_INCLUDE,
    });
  }

  // ── Cards ────────────────────────────────────────────────────────────────

  async createCard(retroId: string, dto: CreateCardDto, userId?: string) {
    const retro = await this.prisma.retrospective.findUnique({ where: { id: retroId } });
    if (!retro) throw new NotFoundException('Retro not found');
    if (retro.isLocked) throw new ForbiddenException('Retro is closed');
    if (retro.status !== RetroStatus.COLECT) throw new BadRequestException('Cards can only be added during Colect phase');

    return this.prisma.retroCard.create({
      data: {
        content: dto.content,
        category: dto.category,
        retroId,
        authorId: userId || null,
        authorName: !userId ? (dto.guestName ?? 'Anônimo') : null,
      },
      include: { author: { select: { id: true, name: true, email: true } }, votes: true, actions: { select: { id: true, title: true } } },
    });
  }

  async updateCard(retroId: string, cardId: string, dto: UpdateCardDto, userId?: string) {
    const card = await this.prisma.retroCard.findFirst({ where: { id: cardId, retroId } });
    if (!card) throw new NotFoundException('Card not found');

    const retro = await this.prisma.retrospective.findUnique({ where: { id: retroId } });
    if (retro!.isLocked) throw new ForbiddenException('Retro is closed');

    if (userId && card.authorId && card.authorId !== userId) throw new ForbiddenException('Not your card');

    return this.prisma.retroCard.update({ where: { id: cardId }, data: dto, include: { author: { select: { id: true, name: true, email: true } }, votes: true, actions: { select: { id: true, title: true } } } });
  }

  async deleteCard(retroId: string, cardId: string, userId?: string) {
    const card = await this.prisma.retroCard.findFirst({ where: { id: cardId, retroId } });
    if (!card) throw new NotFoundException('Card not found');
    if (userId && card.authorId && card.authorId !== userId) throw new ForbiddenException('Not your card');
    return this.prisma.retroCard.delete({ where: { id: cardId } });
  }

  // ── Votes ────────────────────────────────────────────────────────────────

  async voteCard(retroId: string, cardId: string, dto: VoteCardDto, userId?: string) {
    const retro = await this.prisma.retrospective.findUnique({ where: { id: retroId } });
    if (!retro) throw new NotFoundException('Retro not found');
    if (retro.isLocked) throw new ForbiddenException('Retro is closed');
    if (retro.status !== RetroStatus.VOTE) throw new BadRequestException('Voting is only allowed during Vote phase');

    const card = await this.prisma.retroCard.findFirst({ where: { id: cardId, retroId } });
    if (!card) throw new NotFoundException('Card not found');

    // No self-voting
    if (userId && card.authorId === userId) throw new BadRequestException('Cannot vote on your own card');

    const points = dto.points ?? 1;
    const voterId = userId || null;
    const guestId = dto.guestId || null;

    // Check vote limit
    const used = await this.prisma.retroVote.aggregate({
      where: { card: { retroId }, voterId: voterId || undefined, guestId: guestId || undefined },
      _sum: { points: true },
    });
    const usedPoints = used._sum.points ?? 0;
    if (usedPoints + points > retro.voteLimit) {
      throw new BadRequestException(`Insufficient votes. Remaining: ${retro.voteLimit - usedPoints}`);
    }

    return this.prisma.retroVote.create({ data: { cardId, points, voterId, guestId } });
  }

  async removeVote(retroId: string, cardId: string, userId?: string, guestId?: string) {
    const retro = await this.prisma.retrospective.findUnique({ where: { id: retroId } });
    if (!retro || retro.isLocked) throw new ForbiddenException();

    const vote = await this.prisma.retroVote.findFirst({
      where: { cardId, voterId: userId || null, guestId: guestId || null },
    });
    if (!vote) throw new NotFoundException('Vote not found');
    return this.prisma.retroVote.delete({ where: { id: vote.id } });
  }

  // ── Actions ──────────────────────────────────────────────────────────────

  async createAction(retroId: string, dto: CreateActionDto, userId: string) {
    const retro = await this.assertFacilitator(retroId, userId);
    if (retro.isLocked) throw new ForbiddenException('Retro is closed');

    const card = await this.prisma.retroCard.findFirst({ where: { id: dto.cardId, retroId } });
    if (!card) throw new NotFoundException('Card not found');

    return this.prisma.$transaction(async (tx) => {
      let linkedTaskId: string | null = null;

      if (dto.createTask && dto.taskProjectId) {
        const task = await tx.task.create({
          data: {
            title: `[Retro] ${dto.title}`,
            description: `Originada de: ${retro.title}\nCard: "${card.content}"\n\n${dto.description ?? ''}`,
            type: 'TASK',
            status: 'TODO',
            priority: (dto.priority as any) ?? 'MEDIUM',
            dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
            projectId: dto.taskProjectId,
            sprintId: dto.taskSprintId || undefined,
            userId,
          },
        });
        linkedTaskId = task.id;
      }

      return tx.retroAction.create({
        data: {
          title: dto.title,
          description: dto.description,
          priority: (dto.priority as any) ?? 'MEDIUM',
          dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
          retroId,
          cardId: dto.cardId,
          assigneeId: dto.assigneeId || undefined,
          taskId: linkedTaskId || undefined,
        },
        include: {
          card: { select: { id: true, content: true, category: true } },
          assignee: { select: { id: true, name: true, email: true } },
          task: { select: { id: true, title: true, status: true } },
        },
      });
    });
  }

  async getProjects(userId: string) {
    const owned = await this.prisma.company.findMany({ where: { userId }, select: { id: true } });
    const membered = await this.prisma.companyMember.findMany({ where: { userId }, select: { companyId: true } });
    const companyIds = [...owned.map((c) => c.id), ...membered.map((m) => m.companyId)];
    return this.prisma.project.findMany({
      where: { companyId: { in: companyIds } },
      select: { id: true, name: true, companyId: true },
    });
  }

  async getProjectSprints(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException();
    return this.prisma.sprint.findMany({ where: { projectId }, select: { id: true, name: true } });
  }

  async joinRetro(retroId: string, dto: JoinRetroDto, userId?: string) {
    const retro = await this.prisma.retrospective.findUnique({ where: { id: retroId } });
    if (!retro) throw new NotFoundException('Retro not found');
    if (retro.status === RetroStatus.CLOSED) throw new BadRequestException('Retro is closed');

    // Avoid duplicate participants
    const existing = await this.prisma.retroParticipant.findFirst({
      where: {
        retroId,
        ...(userId ? { userId } : { guestId: dto.guestId }),
      },
    });
    if (existing) return existing;

    return this.prisma.retroParticipant.create({
      data: {
        retroId,
        name: dto.name,
        userId: userId || null,
        guestId: dto.guestId || null,
      },
    });
  }

  // ── Public share endpoints ──────────────────────────────────────────────

  async joinRetroByToken(token: string, dto: JoinRetroDto) {
    const retro = await this.prisma.retrospective.findUnique({ where: { shareToken: token } });
    if (!retro) throw new NotFoundException('Retro not found');
    if (retro.status === RetroStatus.CLOSED) throw new BadRequestException('Retro is closed');

    // Avoid duplicate by guestId
    if (dto.guestId) {
      const existing = await this.prisma.retroParticipant.findFirst({
        where: { retroId: retro.id, guestId: dto.guestId },
      });
      if (existing) return { ...existing, retroId: retro.id, retroStatus: retro.status };
    }

    const participant = await this.prisma.retroParticipant.create({
      data: {
        retroId: retro.id,
        name: dto.name,
        guestId: dto.guestId || null,
      },
    });

    return { ...participant, retroId: retro.id, retroStatus: retro.status };
  }

  async createCardByToken(token: string, dto: CreateCardDto) {
    const retro = await this.prisma.retrospective.findUnique({ where: { shareToken: token } });
    if (!retro) throw new NotFoundException('Retro not found');
    if (retro.status !== RetroStatus.COLECT) throw new BadRequestException('Cards can only be added during Colect phase');

    // Validate guestId is a participant
    if (dto.guestId) {
      const participant = await this.prisma.retroParticipant.findFirst({
        where: { retroId: retro.id, guestId: dto.guestId },
      });
      if (!participant) throw new ForbiddenException('You must join the retro first');
    }

    return this.prisma.retroCard.create({
      data: {
        content: dto.content,
        category: dto.category,
        retroId: retro.id,
        authorId: null,
        authorName: dto.guestName ?? 'Anônimo',
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        votes: true,
        actions: { select: { id: true, title: true } },
      },
    });
  }

  async voteCardByToken(token: string, cardId: string, dto: VoteCardDto) {
    const retro = await this.prisma.retrospective.findUnique({ where: { shareToken: token } });
    if (!retro) throw new NotFoundException('Retro not found');
    if (retro.status !== RetroStatus.VOTE) throw new BadRequestException('Voting is only allowed during Vote phase');

    if (!dto.guestId) throw new BadRequestException('guestId is required for anonymous voting');

    // Validate guestId is a participant
    const participant = await this.prisma.retroParticipant.findFirst({
      where: { retroId: retro.id, guestId: dto.guestId },
    });
    if (!participant) throw new ForbiddenException('You must join the retro first');

    // Validate card exists in this retro
    const card = await this.prisma.retroCard.findFirst({ where: { id: cardId, retroId: retro.id } });
    if (!card) throw new NotFoundException('Card not found');

    // Check for duplicate vote on same card
    const existingVote = await this.prisma.retroVote.findFirst({
      where: { cardId, guestId: dto.guestId },
    });
    if (existingVote) throw new BadRequestException('You already voted on this card');

    // Check vote limit (total votes in this retro)
    const points = dto.points ?? 1;
    const usedVotes = await this.prisma.retroVote.aggregate({
      where: { card: { retroId: retro.id }, guestId: dto.guestId },
      _sum: { points: true },
    });
    const usedPoints = usedVotes._sum.points ?? 0;
    if (usedPoints + points > retro.voteLimit) {
      throw new BadRequestException(`Vote limit exceeded. Remaining: ${retro.voteLimit - usedPoints}`);
    }

    return this.prisma.retroVote.create({
      data: { cardId, points, voterId: null, guestId: dto.guestId },
    });
  }
}
