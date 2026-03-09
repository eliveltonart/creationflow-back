import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BacklogService } from './backlog.service';
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
} from './dto/backlog.dto';

@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/backlog')
export class BacklogController {
  constructor(private readonly backlogService: BacklogService) {}

  // ── Backlog Items ──────────────────────────────────────────────────────────

  /** List backlog items with optional filters */
  @Get()
  findAll(
    @Param('projectId') projectId: string,
    @Query() filters: BacklogFilterDto,
  ) {
    return this.backlogService.findAll(projectId, filters);
  }

  /** Get one backlog item with full details */
  @Get(':id')
  findOne(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.backlogService.findOne(projectId, id);
  }

  /** Create a new backlog item */
  @Post()
  create(
    @Param('projectId') projectId: string,
    @Request() req: any,
    @Body() dto: CreateBacklogItemDto,
  ) {
    return this.backlogService.create(projectId, req.user.sub, dto);
  }

  /** Update a backlog item */
  @Put(':id')
  update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: UpdateBacklogItemDto,
  ) {
    return this.backlogService.update(projectId, id, req.user.sub, dto);
  }

  /** Soft-delete (archive) a backlog item */
  @Delete(':id')
  remove(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.backlogService.remove(projectId, id, req.user.sub);
  }

  /** Mark item as refined */
  @Post(':id/refine')
  refine(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: RefineBacklogItemDto,
  ) {
    return this.backlogService.refine(projectId, id, req.user.sub, dto);
  }

  /** Move item to a sprint */
  @Post(':id/move-to-sprint')
  moveToSprint(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: MoveToSprintDto,
  ) {
    return this.backlogService.moveToSprint(projectId, id, req.user.sub, dto);
  }

  /** Return item from sprint back to backlog */
  @Post(':id/return-to-backlog')
  returnToBacklog(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req: any,
  ) {
    return this.backlogService.returnToBacklog(projectId, id, req.user.sub);
  }

  /** Reorder multiple items (drag-and-drop persistence) */
  @Post('reorder')
  reorder(
    @Param('projectId') projectId: string,
    @Request() req: any,
    @Body() dto: ReorderDto,
  ) {
    return this.backlogService.reorder(projectId, req.user.sub, dto);
  }

  /** Move multiple items to a sprint at once */
  @Post('bulk-move')
  bulkMove(
    @Param('projectId') projectId: string,
    @Request() req: any,
    @Body() dto: BulkMoveDto,
  ) {
    return this.backlogService.bulkMoveToSprint(projectId, req.user.sub, dto);
  }

  /** Get backlog health metrics */
  @Get('health')
  health(@Param('projectId') projectId: string) {
    return this.backlogService.health(projectId);
  }

  /** Get items pending refinement (for refinement sessions) */
  @Get('refinement-session')
  refinementSession(@Param('projectId') projectId: string) {
    return this.backlogService.refinementSession(projectId);
  }

  /** Import items in bulk */
  @Post('import')
  import(
    @Param('projectId') projectId: string,
    @Request() req: any,
    @Body() body: { items: Array<Partial<CreateBacklogItemDto>> },
  ) {
    return this.backlogService.importItems(projectId, req.user.sub, body.items);
  }

  // ── Acceptance Criteria ────────────────────────────────────────────────────

  /** Add acceptance criterion to a backlog item */
  @Post(':id/criteria')
  addCriteria(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: AddAcceptanceCriteriaDto,
  ) {
    return this.backlogService.addCriteria(projectId, id, dto);
  }

  /** Update an acceptance criterion */
  @Put(':id/criteria/:cid')
  updateCriteria(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Param('cid') cid: string,
    @Body() dto: UpdateAcceptanceCriteriaDto,
  ) {
    return this.backlogService.updateCriteria(projectId, id, cid, dto);
  }

  /** Remove an acceptance criterion */
  @Delete(':id/criteria/:cid')
  removeCriteria(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Param('cid') cid: string,
  ) {
    return this.backlogService.removeCriteria(projectId, id, cid);
  }

  // ── Dependencies ───────────────────────────────────────────────────────────

  /** Add a dependency to a backlog item */
  @Post(':id/dependencies')
  addDependency(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: AddDependencyDto,
  ) {
    return this.backlogService.addDependency(projectId, id, dto);
  }

  /** Remove a dependency */
  @Delete(':id/dependencies/:did')
  removeDependency(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Param('did') did: string,
  ) {
    return this.backlogService.removeDependency(projectId, id, did);
  }

  // ── Backlog Views ──────────────────────────────────────────────────────────

  /** List saved views */
  @Get('views')
  findAllViews(
    @Param('projectId') projectId: string,
    @Request() req: any,
  ) {
    return this.backlogService.findAllViews(projectId, req.user.sub);
  }

  /** Create a saved view */
  @Post('views')
  createView(
    @Param('projectId') projectId: string,
    @Request() req: any,
    @Body() dto: CreateBacklogViewDto,
  ) {
    return this.backlogService.createView(projectId, req.user.sub, dto);
  }

  /** Update a saved view */
  @Put('views/:vid')
  updateView(
    @Param('projectId') projectId: string,
    @Param('vid') vid: string,
    @Request() req: any,
    @Body() dto: UpdateBacklogViewDto,
  ) {
    return this.backlogService.updateView(projectId, vid, req.user.sub, dto);
  }

  /** Delete a saved view */
  @Delete('views/:vid')
  removeView(
    @Param('projectId') projectId: string,
    @Param('vid') vid: string,
    @Request() req: any,
  ) {
    return this.backlogService.removeView(projectId, vid, req.user.sub);
  }
}

// ── Epics Controller ──────────────────────────────────────────────────────────

@UseGuards(JwtAuthGuard)
@Controller('projects/:projectId/epics')
export class EpicsController {
  constructor(private readonly backlogService: BacklogService) {}

  @Get()
  findAll(@Param('projectId') projectId: string) {
    return this.backlogService.findAllEpics(projectId);
  }

  @Get(':id')
  findOne(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.backlogService.findOneEpic(projectId, id);
  }

  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateEpicDto,
  ) {
    return this.backlogService.createEpic(projectId, dto);
  }

  @Put(':id')
  update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: UpdateEpicDto,
  ) {
    return this.backlogService.updateEpic(projectId, id, dto);
  }

  @Delete(':id')
  remove(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
  ) {
    return this.backlogService.removeEpic(projectId, id);
  }
}
