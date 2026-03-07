import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateHandoffDto,
  UpdateHandoffDto,
  UpdateHandoffStatusDto,
  CreateComponentDto,
  UpdateComponentDto,
  CreateCommentDto,
  LinkTaskDto,
  HandoffStatus,
} from './dto/create-handoff.dto';

const HANDOFF_INCLUDE = {
  project: { select: { id: true, name: true, companyId: true } },
  designer: { select: { id: true, name: true, email: true } },
  developer: { select: { id: true, name: true, email: true } },
  components: { orderBy: { order: 'asc' as const } },
  comments: {
    where: { parentId: null },
    include: {
      author: { select: { id: true, name: true, email: true } },
      replies: {
        include: { author: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'asc' as const },
      },
    },
    orderBy: { createdAt: 'desc' as const },
  },
  linkedTasks: {
    include: {
      task: { select: { id: true, title: true, status: true, type: true } },
    },
  },
  _count: { select: { components: true, comments: true } },
};

const STATUS_TRANSITIONS: Record<HandoffStatus, HandoffStatus[]> = {
  [HandoffStatus.DRAFT]: [HandoffStatus.READY, HandoffStatus.ARCHIVED],
  [HandoffStatus.READY]: [HandoffStatus.IMPLEMENTING, HandoffStatus.DRAFT, HandoffStatus.ARCHIVED],
  [HandoffStatus.IMPLEMENTING]: [HandoffStatus.IMPLEMENTED, HandoffStatus.READY, HandoffStatus.ARCHIVED],
  [HandoffStatus.IMPLEMENTED]: [HandoffStatus.APPROVED, HandoffStatus.IMPLEMENTING, HandoffStatus.ARCHIVED],
  [HandoffStatus.APPROVED]: [HandoffStatus.ARCHIVED],
  [HandoffStatus.ARCHIVED]: [],
};

@Injectable()
export class HandoffService {
  constructor(private prisma: PrismaService) {}

  private async assertAccess(handoffId: string, userId: string) {
    const handoff = await this.prisma.designHandoff.findUnique({
      where: { id: handoffId },
      include: { project: true },
    });
    if (!handoff) throw new NotFoundException('Handoff not found');

    const companyId = handoff.project.companyId;
    const company = await this.prisma.company.findFirst({
      where: { id: companyId, userId },
    });
    const member = await this.prisma.companyMember.findFirst({
      where: { companyId, userId },
    });
    if (!company && !member) throw new ForbiddenException();
    return handoff;
  }

  // ── Handoffs ──────────────────────────────────────────────────────────────────

  async create(dto: CreateHandoffDto, userId: string) {
    // verify user has access to project
    const project = await this.prisma.project.findUnique({ where: { id: dto.projectId } });
    if (!project) throw new NotFoundException('Project not found');

    const company = await this.prisma.company.findFirst({
      where: { id: project.companyId, userId },
    });
    const member = await this.prisma.companyMember.findFirst({
      where: { companyId: project.companyId, userId },
    });
    if (!company && !member) throw new ForbiddenException();

    return this.prisma.$transaction(async (tx) => {
      // 1. Create the handoff
      const handoff = await tx.designHandoff.create({
        data: {
          title: dto.title,
          description: dto.description,
          rationale: dto.rationale,
          userJourneyContext: dto.userJourneyContext,
          projectId: dto.projectId,
          designerId: userId,
          developerId: dto.developerId,
        },
      });

      // 2. Create a linked task on the project board
      const task = await tx.task.create({
        data: {
          title: `[Handoff] ${dto.title}`,
          description: `Handoff ID: ${handoff.id}\n\nTarefa criada automaticamente para rastrear a implementação do handoff de design.`,
          type: 'TASK',
          status: 'TODO',
          priority: 'MEDIUM',
          projectId: dto.projectId,
          userId,
        },
      });

      // 3. Link the task to the handoff
      await tx.handoffLinkedTask.create({
        data: { handoffId: handoff.id, taskId: task.id },
      });

      // 4. Return full handoff with includes
      return tx.designHandoff.findUnique({
        where: { id: handoff.id },
        include: HANDOFF_INCLUDE,
      });
    });
  }

  async findAll(userId: string, projectId?: string, status?: string) {
    // Get all company IDs the user belongs to
    const owned = await this.prisma.company.findMany({
      where: { userId },
      select: { id: true },
    });
    const membered = await this.prisma.companyMember.findMany({
      where: { userId },
      select: { companyId: true },
    });
    const companyIds = [
      ...owned.map((c) => c.id),
      ...membered.map((m) => m.companyId),
    ];

    return this.prisma.designHandoff.findMany({
      where: {
        project: { companyId: { in: companyIds } },
        ...(projectId ? { projectId } : {}),
        ...(status ? { status: status as HandoffStatus } : {}),
      },
      include: HANDOFF_INCLUDE,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    await this.assertAccess(id, userId);
    return this.prisma.designHandoff.findUnique({
      where: { id },
      include: HANDOFF_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateHandoffDto, userId: string) {
    const handoff = await this.assertAccess(id, userId);
    if (
      handoff.status !== HandoffStatus.DRAFT &&
      handoff.status !== HandoffStatus.READY
    ) {
      throw new BadRequestException(
        'Cannot edit a handoff that is being implemented or has been approved',
      );
    }

    return this.prisma.designHandoff.update({
      where: { id },
      data: { ...dto },
      include: HANDOFF_INCLUDE,
    });
  }

  async updateStatus(id: string, dto: UpdateHandoffStatusDto, userId: string) {
    const handoff = await this.assertAccess(id, userId);
    const allowed = STATUS_TRANSITIONS[handoff.status as HandoffStatus];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${handoff.status} to ${dto.status}`,
      );
    }

    const data: any = { status: dto.status };
    if (dto.status === HandoffStatus.READY) {
      data.submittedAt = new Date();
      data.iterationCount = { increment: 1 };
    }
    if (dto.status === HandoffStatus.APPROVED) {
      data.completedAt = new Date();
    }

    return this.prisma.designHandoff.update({
      where: { id },
      data,
      include: HANDOFF_INCLUDE,
    });
  }

  async remove(id: string, userId: string) {
    const handoff = await this.assertAccess(id, userId);
    if (handoff.designerId !== userId) {
      throw new ForbiddenException('Only the designer can delete a handoff');
    }
    await this.prisma.designHandoff.delete({ where: { id } });
    return { deleted: true };
  }

  // ── Components ────────────────────────────────────────────────────────────────

  async createComponent(handoffId: string, dto: CreateComponentDto, userId: string) {
    await this.assertAccess(handoffId, userId);
    return this.prisma.handoffComponent.create({
      data: { ...dto, handoffId },
    });
  }

  async updateComponent(
    handoffId: string,
    componentId: string,
    dto: UpdateComponentDto,
    userId: string,
  ) {
    await this.assertAccess(handoffId, userId);
    return this.prisma.handoffComponent.update({
      where: { id: componentId },
      data: { ...dto },
    });
  }

  async removeComponent(handoffId: string, componentId: string, userId: string) {
    await this.assertAccess(handoffId, userId);
    await this.prisma.handoffComponent.delete({ where: { id: componentId } });
    return { deleted: true };
  }

  // ── Comments ──────────────────────────────────────────────────────────────────

  async createComment(handoffId: string, dto: CreateCommentDto, userId: string) {
    await this.assertAccess(handoffId, userId);
    return this.prisma.handoffComment.create({
      data: {
        text: dto.text,
        componentId: dto.componentId,
        parentId: dto.parentId,
        handoffId,
        authorId: userId,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        replies: {
          include: { author: { select: { id: true, name: true, email: true } } },
        },
      },
    });
  }

  async resolveComment(handoffId: string, commentId: string, userId: string) {
    await this.assertAccess(handoffId, userId);
    return this.prisma.handoffComment.update({
      where: { id: commentId },
      data: { resolved: true },
    });
  }

  // ── Linked Tasks ──────────────────────────────────────────────────────────────

  async linkTasks(handoffId: string, dto: LinkTaskDto, userId: string) {
    await this.assertAccess(handoffId, userId);
    await this.prisma.handoffLinkedTask.createMany({
      data: dto.taskIds.map((taskId) => ({ handoffId, taskId })),
      skipDuplicates: true,
    });
    return this.findOne(handoffId, userId);
  }

  async unlinkTask(handoffId: string, taskId: string, userId: string) {
    await this.assertAccess(handoffId, userId);
    await this.prisma.handoffLinkedTask.deleteMany({
      where: { handoffId, taskId },
    });
    return { deleted: true };
  }

  // ── Projects for selector ─────────────────────────────────────────────────────

  async getAccessibleProjects(userId: string) {
    const owned = await this.prisma.company.findMany({
      where: { userId },
      select: { id: true },
    });
    const membered = await this.prisma.companyMember.findMany({
      where: { userId },
      select: { companyId: true },
    });
    const companyIds = [
      ...owned.map((c) => c.id),
      ...membered.map((m) => m.companyId),
    ];
    return this.prisma.project.findMany({
      where: { companyId: { in: companyIds } },
      select: { id: true, name: true, companyId: true, company: { select: { name: true } } },
      orderBy: { name: 'asc' },
    });
  }
}
