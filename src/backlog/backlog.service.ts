import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreateBacklogItemDto,
  UpdateBacklogItemDto,
  RefineBacklogItemDto,
  MoveToSprintDto,
  ReorderDto,
  BulkMoveDto,
  BacklogFilterDto,
  CreateEpicDto,
  UpdateEpicDto,
  AddAcceptanceCriteriaDto,
  UpdateAcceptanceCriteriaDto,
  AddDependencyDto,
  CreateBacklogViewDto,
  UpdateBacklogViewDto,
  BacklogRefinementStatus,
  BacklogItemStatus,
} from './dto/backlog.dto';

// ── Include helpers ───────────────────────────────────────────────────────────

const BACKLOG_ITEM_INCLUDE = {
  epic: { select: { id: true, name: true, color: true, status: true } },
  sprint: { select: { id: true, name: true, isActive: true, startDate: true, endDate: true } },
  assignee: { select: { id: true, fullName: true, socialName: true } },
  refinedBy: { select: { id: true, fullName: true, socialName: true } },
  createdBy: { select: { id: true, fullName: true, socialName: true } },
  acceptanceCriteria: { orderBy: { orderIndex: 'asc' as const } },
  dependencies: {
    include: {
      dependsOn: { select: { id: true, title: true, status: true, priority: true } },
    },
  },
  _count: { select: { acceptanceCriteria: true, dependencies: true, history: true } },
} as const;

// ── Service ───────────────────────────────────────────────────────────────────

@Injectable()
export class BacklogService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Helpers ────────────────────────────────────────────────────────────────

  private async resolveEmployer(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { companyId: true },
    });
    if (!project) throw new NotFoundException('Project not found');

    const employer = await this.prisma.employer.findFirst({
      where: { userId, companyId: project.companyId },
    });
    if (!employer)
      throw new ForbiddenException('No employer profile in this company');
    return employer;
  }

  private async assertItemBelongsToProject(id: string, projectId: string) {
    const item = await this.prisma.backlogItem.findFirst({
      where: { id, projectId },
    });
    if (!item) throw new NotFoundException('Backlog item not found');
    return item;
  }

  private async logHistory(
    backlogItemId: string,
    action: string,
    performedById: string,
    oldValue?: Record<string, any>,
    newValue?: Record<string, any>,
  ) {
    await this.prisma.backlogHistory.create({
      data: { backlogItemId, action, performedById, oldValue, newValue },
    });
  }

  // ── Backlog Items ──────────────────────────────────────────────────────────

  async findAll(projectId: string, filters: BacklogFilterDto) {
    const where: any = { projectId };

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.epicId) where.epicId = filters.epicId;
    if (filters.type?.length) where.type = { in: filters.type };
    if (filters.priority?.length) where.priority = { in: filters.priority };
    if (filters.refinementStatus?.length)
      where.refinementStatus = { in: filters.refinementStatus };
    if (filters.status?.length) {
      where.status = { in: filters.status };
    } else {
      // Default: return only active (non-archived) items
      where.status = { not: BacklogItemStatus.ARCHIVED };
    }
    if (filters.assigneeId) where.assigneeId = filters.assigneeId;
    if (filters.noSprint) {
      where.sprintId = null;
      where.status = BacklogItemStatus.BACKLOG;
    } else if (filters.sprintId) {
      where.sprintId = filters.sprintId;
    }

    const items = await this.prisma.backlogItem.findMany({
      where,
      include: BACKLOG_ITEM_INCLUDE,
      orderBy: [{ orderIndex: 'asc' }, { createdAt: 'asc' }],
    });

    if (!filters.groupByEpic) return items;

    // Group by epic
    const epics = await this.prisma.epic.findMany({
      where: { projectId },
      orderBy: { orderIndex: 'asc' },
    });

    const groups: Record<string, any[]> = {};
    const epicMap: Record<string, any> = {};

    for (const epic of epics) {
      groups[epic.id] = [];
      epicMap[epic.id] = epic;
    }
    groups['__no_epic__'] = [];

    for (const item of items) {
      const key = item.epicId ?? '__no_epic__';
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }

    return [
      ...epics.map((e) => ({
        epic: e,
        items: groups[e.id] ?? [],
      })),
      { epic: null, items: groups['__no_epic__'] ?? [] },
    ].filter((g) => g.items.length > 0 || g.epic !== null);
  }

  async findOne(projectId: string, id: string) {
    const item = await this.prisma.backlogItem.findFirst({
      where: { id, projectId },
      include: {
        ...BACKLOG_ITEM_INCLUDE,
        history: {
          include: {
            performedBy: { select: { id: true, fullName: true } },
          },
          orderBy: { performedAt: 'desc' },
          take: 50,
        },
        dependents: {
          include: {
            backlogItem: { select: { id: true, title: true, status: true, priority: true } },
          },
        },
      },
    });
    if (!item) throw new NotFoundException('Backlog item not found');
    return item;
  }

  async create(
    projectId: string,
    userId: string,
    dto: CreateBacklogItemDto,
  ) {
    const employer = dto.createdById
      ? await this.prisma.employer.findUnique({ where: { id: dto.createdById } })
      : await this.resolveEmployer(projectId, userId);

    if (!employer) throw new NotFoundException('Employer not found');

    // Determine orderIndex: put at the end of the backlog
    const maxOrder = await this.prisma.backlogItem.aggregate({
      where: { projectId },
      _max: { orderIndex: true },
    });
    const orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;

    const item = await this.prisma.backlogItem.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type as any,
        priority: dto.priority as any,
        storyPoints: dto.storyPoints,
        hoursEstimated: dto.hoursEstimated,
        epicId: dto.epicId,
        sprintId: dto.sprintId,
        assigneeId: dto.assigneeId,
        tags: dto.tags ?? [],
        externalId: dto.externalId,
        orderIndex,
        projectId,
        createdById: employer.id,
        status: dto.sprintId ? ('IN_SPRINT' as any) : ('BACKLOG' as any),
      },
      include: BACKLOG_ITEM_INCLUDE,
    });

    await this.logHistory(item.id, 'CREATE', employer.id, undefined, {
      title: item.title,
    });

    return item;
  }

  async update(
    projectId: string,
    id: string,
    userId: string,
    dto: UpdateBacklogItemDto,
  ) {
    const old = await this.assertItemBelongsToProject(id, projectId);
    const employer = await this.resolveEmployer(projectId, userId);

    const item = await this.prisma.backlogItem.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.type !== undefined && { type: dto.type as any }),
        ...(dto.priority !== undefined && { priority: dto.priority as any }),
        ...(dto.status !== undefined && { status: dto.status as any }),
        ...(dto.storyPoints !== undefined && { storyPoints: dto.storyPoints }),
        ...(dto.hoursEstimated !== undefined && { hoursEstimated: dto.hoursEstimated }),
        ...(dto.epicId !== undefined && { epicId: dto.epicId }),
        ...(dto.sprintId !== undefined && { sprintId: dto.sprintId }),
        ...(dto.assigneeId !== undefined && { assigneeId: dto.assigneeId }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        ...(dto.refinementNotes !== undefined && { refinementNotes: dto.refinementNotes }),
        ...(dto.orderIndex !== undefined && { orderIndex: dto.orderIndex }),
      },
      include: BACKLOG_ITEM_INCLUDE,
    });

    await this.logHistory(id, 'UPDATE', employer.id, old as any, dto as any);
    return item;
  }

  async remove(projectId: string, id: string, userId: string) {
    await this.assertItemBelongsToProject(id, projectId);

    // Soft delete: mark as ARCHIVED
    const employer = await this.resolveEmployer(projectId, userId);
    const item = await this.prisma.backlogItem.update({
      where: { id },
      data: { status: 'ARCHIVED' as any },
    });
    await this.logHistory(id, 'ARCHIVE', employer.id);
    return item;
  }

  async refine(
    projectId: string,
    id: string,
    userId: string,
    dto: RefineBacklogItemDto,
  ) {
    await this.assertItemBelongsToProject(id, projectId);
    const employer = await this.resolveEmployer(projectId, userId);

    const item = await this.prisma.backlogItem.update({
      where: { id },
      data: {
        refinementStatus: 'REFINED' as any,
        refinedById: employer.id,
        refinedAt: new Date(),
        ...(dto.refinementNotes !== undefined && { refinementNotes: dto.refinementNotes }),
        ...(dto.storyPoints !== undefined && { storyPoints: dto.storyPoints }),
        ...(dto.hoursEstimated !== undefined && { hoursEstimated: dto.hoursEstimated }),
      },
      include: BACKLOG_ITEM_INCLUDE,
    });

    await this.logHistory(id, 'REFINE', employer.id, undefined, {
      refinementStatus: 'REFINED',
      storyPoints: dto.storyPoints,
    });

    return item;
  }

  async moveToSprint(
    projectId: string,
    id: string,
    userId: string,
    dto: MoveToSprintDto,
  ) {
    await this.assertItemBelongsToProject(id, projectId);
    const employer = await this.resolveEmployer(projectId, userId);

    // Validate sprint belongs to the same project
    const sprint = await this.prisma.sprint.findFirst({
      where: { id: dto.sprintId, projectId },
    });
    if (!sprint) throw new NotFoundException('Sprint not found in this project');

    const item = await this.prisma.backlogItem.update({
      where: { id },
      data: {
        sprintId: dto.sprintId,
        status: 'IN_SPRINT' as any,
      },
      include: BACKLOG_ITEM_INCLUDE,
    });

    await this.logHistory(id, 'MOVE_TO_SPRINT', employer.id, undefined, {
      sprintId: dto.sprintId,
      sprintName: sprint.name,
    });

    return item;
  }

  async returnToBacklog(projectId: string, id: string, userId: string) {
    await this.assertItemBelongsToProject(id, projectId);
    const employer = await this.resolveEmployer(projectId, userId);

    const item = await this.prisma.backlogItem.update({
      where: { id },
      data: { sprintId: null, status: 'BACKLOG' as any },
      include: BACKLOG_ITEM_INCLUDE,
    });

    await this.logHistory(id, 'RETURN_TO_BACKLOG', employer.id);
    return item;
  }

  async reorder(projectId: string, userId: string, dto: ReorderDto) {
    const updates = dto.items.map((item) =>
      this.prisma.backlogItem.updateMany({
        where: { id: item.id, projectId },
        data: { orderIndex: item.orderIndex },
      }),
    );
    await this.prisma.$transaction(updates);
    return { success: true, updated: dto.items.length };
  }

  async bulkMoveToSprint(
    projectId: string,
    userId: string,
    dto: BulkMoveDto,
  ) {
    const sprint = await this.prisma.sprint.findFirst({
      where: { id: dto.sprintId, projectId },
    });
    if (!sprint) throw new NotFoundException('Sprint not found in this project');

    const employer = await this.resolveEmployer(projectId, userId);

    await this.prisma.backlogItem.updateMany({
      where: { id: { in: dto.itemIds }, projectId },
      data: { sprintId: dto.sprintId, status: 'IN_SPRINT' as any },
    });

    // Log history for each item
    await Promise.all(
      dto.itemIds.map((itemId) =>
        this.logHistory(itemId, 'BULK_MOVE_TO_SPRINT', employer.id, undefined, {
          sprintId: dto.sprintId,
        }),
      ),
    );

    return { success: true, moved: dto.itemIds.length, sprintId: dto.sprintId };
  }

  async health(projectId: string) {
    const [total, refined, estimated, noEpic, noSp, criticalNoSp] =
      await Promise.all([
        this.prisma.backlogItem.count({
          where: { projectId, status: { not: 'ARCHIVED' as any } },
        }),
        this.prisma.backlogItem.count({
          where: {
            projectId,
            status: { not: 'ARCHIVED' as any },
            refinementStatus: 'REFINED' as any,
          },
        }),
        this.prisma.backlogItem.count({
          where: {
            projectId,
            status: { not: 'ARCHIVED' as any },
            storyPoints: { not: null },
          },
        }),
        this.prisma.backlogItem.count({
          where: {
            projectId,
            status: { not: 'ARCHIVED' as any },
            epicId: null,
          },
        }),
        this.prisma.backlogItem.count({
          where: {
            projectId,
            status: { not: 'ARCHIVED' as any },
            storyPoints: null,
          },
        }),
        this.prisma.backlogItem.count({
          where: {
            projectId,
            status: { not: 'ARCHIVED' as any },
            priority: { in: ['URGENT', 'HIGH'] as any[] },
            storyPoints: null,
          },
        }),
      ]);

    // Obsolete: not updated in 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    const obsolete = await this.prisma.backlogItem.count({
      where: {
        projectId,
        status: { not: 'ARCHIVED' as any },
        updatedAt: { lt: ninetyDaysAgo },
      },
    });

    const totalSp = await this.prisma.backlogItem.aggregate({
      where: { projectId, status: { not: 'ARCHIVED' as any } },
      _sum: { storyPoints: true },
    });

    const pctRefined = total > 0 ? Math.round((refined / total) * 100) : 100;
    const pctEstimated = total > 0 ? Math.round((estimated / total) * 100) : 100;
    const pctNoEpic = total > 0 ? Math.round((noEpic / total) * 100) : 0;

    return {
      total,
      refined,
      estimated,
      noEpic,
      noStoryPoints: noSp,
      criticalWithoutEstimate: criticalNoSp,
      obsolete,
      totalStoryPoints: totalSp._sum.storyPoints ?? 0,
      pctRefined,
      pctEstimated,
      pctNoEpic,
      alerts: [
        ...(pctRefined < 80 ? [`Only ${pctRefined}% of items are refined (recommended: 80%+)`] : []),
        ...(pctEstimated < 70 ? [`Only ${pctEstimated}% of items are estimated (recommended: 70%+)`] : []),
        ...(obsolete > 0 ? [`${obsolete} item(s) not updated in 90+ days`] : []),
        ...(pctNoEpic > 20 ? [`${pctNoEpic}% of items have no epic (recommended: <20%)`] : []),
        ...(criticalNoSp > 0 ? [`${criticalNoSp} critical/high item(s) without story points`] : []),
      ],
    };
  }

  async refinementSession(projectId: string) {
    return this.prisma.backlogItem.findMany({
      where: {
        projectId,
        status: 'BACKLOG' as any,
        refinementStatus: { not: 'REFINED' as any },
      },
      include: BACKLOG_ITEM_INCLUDE,
      orderBy: [{ priority: 'desc' }, { orderIndex: 'asc' }],
    });
  }

  // ── Acceptance Criteria ────────────────────────────────────────────────────

  async addCriteria(
    projectId: string,
    itemId: string,
    dto: AddAcceptanceCriteriaDto,
  ) {
    await this.assertItemBelongsToProject(itemId, projectId);

    const maxOrder = await this.prisma.backlogAcceptanceCriteria.aggregate({
      where: { backlogItemId: itemId },
      _max: { orderIndex: true },
    });
    const orderIndex = dto.orderIndex ?? (maxOrder._max.orderIndex ?? -1) + 1;

    return this.prisma.backlogAcceptanceCriteria.create({
      data: { backlogItemId: itemId, description: dto.description, orderIndex },
    });
  }

  async updateCriteria(
    projectId: string,
    itemId: string,
    criteriaId: string,
    dto: UpdateAcceptanceCriteriaDto,
  ) {
    await this.assertItemBelongsToProject(itemId, projectId);
    const criteria = await this.prisma.backlogAcceptanceCriteria.findFirst({
      where: { id: criteriaId, backlogItemId: itemId },
    });
    if (!criteria) throw new NotFoundException('Acceptance criteria not found');

    return this.prisma.backlogAcceptanceCriteria.update({
      where: { id: criteriaId },
      data: dto,
    });
  }

  async removeCriteria(projectId: string, itemId: string, criteriaId: string) {
    await this.assertItemBelongsToProject(itemId, projectId);
    return this.prisma.backlogAcceptanceCriteria.delete({
      where: { id: criteriaId },
    });
  }

  // ── Dependencies ───────────────────────────────────────────────────────────

  async addDependency(
    projectId: string,
    itemId: string,
    dto: AddDependencyDto,
  ) {
    await this.assertItemBelongsToProject(itemId, projectId);
    await this.assertItemBelongsToProject(dto.dependsOnId, projectId);

    if (itemId === dto.dependsOnId)
      throw new BadRequestException('Item cannot depend on itself');

    const existing = await this.prisma.backlogDependency.findUnique({
      where: {
        backlogItemId_dependsOnId: { backlogItemId: itemId, dependsOnId: dto.dependsOnId },
      },
    });
    if (existing) throw new BadRequestException('Dependency already exists');

    return this.prisma.backlogDependency.create({
      data: {
        backlogItemId: itemId,
        dependsOnId: dto.dependsOnId,
        type: dto.type as any,
      },
      include: {
        dependsOn: { select: { id: true, title: true, status: true } },
      },
    });
  }

  async removeDependency(projectId: string, itemId: string, depId: string) {
    await this.assertItemBelongsToProject(itemId, projectId);
    const dep = await this.prisma.backlogDependency.findFirst({
      where: { id: depId, backlogItemId: itemId },
    });
    if (!dep) throw new NotFoundException('Dependency not found');
    return this.prisma.backlogDependency.delete({ where: { id: depId } });
  }

  // ── Epics ──────────────────────────────────────────────────────────────────

  async findAllEpics(projectId: string) {
    return this.prisma.epic.findMany({
      where: { projectId },
      include: {
        owner: { select: { id: true, fullName: true } },
        _count: { select: { backlogItems: true } },
        backlogItems: {
          select: { storyPoints: true, status: true },
        },
      },
      orderBy: { orderIndex: 'asc' },
    });
  }

  async findOneEpic(projectId: string, id: string) {
    const epic = await this.prisma.epic.findFirst({ where: { id, projectId } });
    if (!epic) throw new NotFoundException('Epic not found');
    return epic;
  }

  async createEpic(projectId: string, dto: CreateEpicDto) {
    const maxOrder = await this.prisma.epic.aggregate({
      where: { projectId },
      _max: { orderIndex: true },
    });
    const orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;

    return this.prisma.epic.create({
      data: {
        ...dto,
        projectId,
        orderIndex,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
      },
    });
  }

  async updateEpic(projectId: string, id: string, dto: UpdateEpicDto) {
    await this.findOneEpic(projectId, id);
    return this.prisma.epic.update({
      where: { id },
      data: {
        ...dto,
        targetDate: dto.targetDate ? new Date(dto.targetDate) : undefined,
      },
    });
  }

  async removeEpic(projectId: string, id: string) {
    await this.findOneEpic(projectId, id);
    // Detach backlog items from this epic first
    await this.prisma.backlogItem.updateMany({
      where: { epicId: id },
      data: { epicId: null },
    });
    return this.prisma.epic.delete({ where: { id } });
  }

  // ── Backlog Views ──────────────────────────────────────────────────────────

  async findAllViews(projectId: string, userId: string) {
    const employer = await this.resolveEmployer(projectId, userId).catch(() => null);
    return this.prisma.backlogView.findMany({
      where: {
        projectId,
        OR: [
          { isShared: true },
          ...(employer ? [{ createdById: employer.id }] : []),
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createView(projectId: string, userId: string, dto: CreateBacklogViewDto) {
    const employer = await this.resolveEmployer(projectId, userId);
    return this.prisma.backlogView.create({
      data: {
        name: dto.name,
        filters: dto.filters as any,
        isShared: dto.isShared ?? false,
        projectId,
        createdById: employer.id,
      },
    });
  }

  async updateView(
    projectId: string,
    id: string,
    userId: string,
    dto: UpdateBacklogViewDto,
  ) {
    const employer = await this.resolveEmployer(projectId, userId);
    const view = await this.prisma.backlogView.findFirst({ where: { id, projectId } });
    if (!view) throw new NotFoundException('View not found');
    if (view.createdById !== employer.id)
      throw new ForbiddenException('Only the creator can update this view');

    return this.prisma.backlogView.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.filters !== undefined && { filters: dto.filters as any }),
        ...(dto.isShared !== undefined && { isShared: dto.isShared }),
      },
    });
  }

  async removeView(projectId: string, id: string, userId: string) {
    const employer = await this.resolveEmployer(projectId, userId);
    const view = await this.prisma.backlogView.findFirst({ where: { id, projectId } });
    if (!view) throw new NotFoundException('View not found');
    if (view.createdById !== employer.id)
      throw new ForbiddenException('Only the creator can delete this view');
    return this.prisma.backlogView.delete({ where: { id } });
  }

  // ── Import ─────────────────────────────────────────────────────────────────

  async importItems(
    projectId: string,
    userId: string,
    items: Array<Partial<CreateBacklogItemDto>>,
  ) {
    const employer = await this.resolveEmployer(projectId, userId);
    const maxOrder = await this.prisma.backlogItem.aggregate({
      where: { projectId },
      _max: { orderIndex: true },
    });
    let orderIndex = (maxOrder._max.orderIndex ?? -1) + 1;

    const created = await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.backlogItem.create({
          data: {
            title: item.title ?? 'Imported item',
            description: item.description,
            type: (item.type as any) ?? 'FEATURE',
            priority: (item.priority as any) ?? 'MEDIUM',
            storyPoints: item.storyPoints,
            hoursEstimated: item.hoursEstimated,
            epicId: item.epicId,
            tags: item.tags ?? [],
            externalId: item.externalId,
            orderIndex: orderIndex++,
            projectId,
            createdById: employer.id,
          },
        }),
      ),
    );

    return { imported: created.length, items: created };
  }
}
