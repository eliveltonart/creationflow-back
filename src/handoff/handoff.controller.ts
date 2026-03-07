import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { HandoffService } from './handoff.service';
import {
  CreateHandoffDto,
  UpdateHandoffDto,
  UpdateHandoffStatusDto,
  CreateComponentDto,
  UpdateComponentDto,
  CreateCommentDto,
  LinkTaskDto,
} from './dto/create-handoff.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('handoffs')
export class HandoffController {
  constructor(private readonly service: HandoffService) {}

  // ── Handoffs ──────────────────────────────────────────────────────────────────

  @Post()
  create(@Body() dto: CreateHandoffDto, @Request() req) {
    return this.service.create(dto, req.user.sub);
  }

  @Get()
  findAll(
    @Query('projectId') projectId: string,
    @Query('status') status: string,
    @Request() req,
  ) {
    return this.service.findAll(req.user.sub, projectId, status);
  }

  @Get('projects')
  getProjects(@Request() req) {
    return this.service.getAccessibleProjects(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.service.findOne(id, req.user.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateHandoffDto, @Request() req) {
    return this.service.update(id, dto, req.user.sub);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateHandoffStatusDto,
    @Request() req,
  ) {
    return this.service.updateStatus(id, dto, req.user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.service.remove(id, req.user.sub);
  }

  // ── Components ────────────────────────────────────────────────────────────────

  @Post(':id/components')
  createComponent(
    @Param('id') id: string,
    @Body() dto: CreateComponentDto,
    @Request() req,
  ) {
    return this.service.createComponent(id, dto, req.user.sub);
  }

  @Patch(':id/components/:componentId')
  updateComponent(
    @Param('id') id: string,
    @Param('componentId') componentId: string,
    @Body() dto: UpdateComponentDto,
    @Request() req,
  ) {
    return this.service.updateComponent(id, componentId, dto, req.user.sub);
  }

  @Delete(':id/components/:componentId')
  removeComponent(
    @Param('id') id: string,
    @Param('componentId') componentId: string,
    @Request() req,
  ) {
    return this.service.removeComponent(id, componentId, req.user.sub);
  }

  // ── Comments ──────────────────────────────────────────────────────────────────

  @Post(':id/comments')
  createComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @Request() req,
  ) {
    return this.service.createComment(id, dto, req.user.sub);
  }

  @Patch(':id/comments/:commentId/resolve')
  resolveComment(
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Request() req,
  ) {
    return this.service.resolveComment(id, commentId, req.user.sub);
  }

  // ── Linked Tasks ──────────────────────────────────────────────────────────────

  @Post(':id/tasks')
  linkTasks(
    @Param('id') id: string,
    @Body() dto: LinkTaskDto,
    @Request() req,
  ) {
    return this.service.linkTasks(id, dto, req.user.sub);
  }

  @Delete(':id/tasks/:taskId')
  unlinkTask(
    @Param('id') id: string,
    @Param('taskId') taskId: string,
    @Request() req,
  ) {
    return this.service.unlinkTask(id, taskId, req.user.sub);
  }
}
