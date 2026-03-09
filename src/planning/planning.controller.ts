import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlanningService } from './planning.service';
import {
  CreatePlanningDto,
  UpdatePlanningDto,
  AdvanceStepDto,
  AddPlanningTaskDto,
  UpdatePlanningTaskDto,
  CastVoteDto,
  RevealVotesDto,
  ResetVotesDto,
  CreateRiteDto,
  CreateIntruderDto,
  CreateAbsenceDto,
  CommitParticipantDto,
  AddParticipantDto,
} from './dto/planning.dto';

@Controller('projects/:projectId/plannings')
@UseGuards(JwtAuthGuard)
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  // ── Planning CRUD ──────────────────────────────────────────────────────────
  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreatePlanningDto,
    @Request() req,
  ) {
    dto.projectId = projectId;
    return this.planningService.create(dto, req.user.sub);
  }

  @Get()
  findAll(@Param('projectId') projectId: string, @Request() req) {
    return this.planningService.findByProject(projectId, req.user.sub);
  }

  @Get(':id')
  findOne(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.planningService.findOne(projectId, id, req.user.sub);
  }

  @Patch(':id')
  update(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePlanningDto,
    @Request() req,
  ) {
    return this.planningService.update(projectId, id, dto, req.user.sub);
  }

  @Delete(':id')
  remove(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.planningService.remove(projectId, id, req.user.sub);
  }

  // ── Status transitions ─────────────────────────────────────────────────────
  @Post(':id/start')
  start(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.planningService.start(projectId, id, req.user.sub);
  }

  @Post(':id/close')
  close(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.planningService.close(projectId, id, req.user.sub);
  }

  @Post(':id/advance')
  advanceStep(
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() dto: AdvanceStepDto,
    @Request() req,
  ) {
    return this.planningService.advanceStep(projectId, id, dto.step, req.user.sub);
  }

  // ── Tasks ──────────────────────────────────────────────────────────────────
  @Post(':id/tasks')
  addTask(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Body() dto: AddPlanningTaskDto,
    @Request() req,
  ) {
    return this.planningService.addTask(projectId, planningId, dto, req.user.sub);
  }

  @Patch(':id/tasks/:taskId')
  updateTask(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Param('taskId') planningTaskId: string,
    @Body() dto: UpdatePlanningTaskDto,
    @Request() req,
  ) {
    return this.planningService.updateTask(projectId, planningId, planningTaskId, dto, req.user.sub);
  }

  @Delete(':id/tasks/:taskId')
  removeTask(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Param('taskId') planningTaskId: string,
    @Request() req,
  ) {
    return this.planningService.removeTask(projectId, planningId, planningTaskId, req.user.sub);
  }

  // ── Votes ──────────────────────────────────────────────────────────────────
  @Post(':id/votes')
  castVote(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Body() dto: CastVoteDto,
    @Request() req,
  ) {
    return this.planningService.castVote(projectId, planningId, dto, req.user.sub);
  }

  @Get(':id/votes/:planningTaskId')
  getVotes(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Param('planningTaskId') planningTaskId: string,
    @Request() req,
  ) {
    return this.planningService.getVotes(projectId, planningId, planningTaskId, req.user.sub);
  }

  @Post(':id/votes/reset')
  resetVotes(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Body() dto: ResetVotesDto,
    @Request() req,
  ) {
    return this.planningService.resetVotes(projectId, planningId, dto, req.user.sub);
  }

  // ── Capacity ───────────────────────────────────────────────────────────────
  @Get(':id/capacity')
  getCapacity(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Request() req,
  ) {
    return this.planningService.getCapacity(projectId, planningId, req.user.sub);
  }

  @Post(':id/rites')
  addRite(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Body() dto: CreateRiteDto,
    @Request() req,
  ) {
    return this.planningService.addRite(projectId, planningId, dto, req.user.sub);
  }

  @Delete(':id/rites/:riteId')
  removeRite(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Param('riteId') riteId: string,
    @Request() req,
  ) {
    return this.planningService.removeRite(projectId, planningId, riteId, req.user.sub);
  }

  @Post(':id/intruders')
  addIntruder(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Body() dto: CreateIntruderDto,
    @Request() req,
  ) {
    return this.planningService.addIntruder(projectId, planningId, dto, req.user.sub);
  }

  @Delete(':id/intruders/:intruderId')
  removeIntruder(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Param('intruderId') intruderId: string,
    @Request() req,
  ) {
    return this.planningService.removeIntruder(projectId, planningId, intruderId, req.user.sub);
  }

  @Post(':id/absences')
  addAbsence(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Body() dto: CreateAbsenceDto,
    @Request() req,
  ) {
    return this.planningService.addAbsence(projectId, planningId, dto, req.user.sub);
  }

  @Delete(':id/absences/:absenceId')
  removeAbsence(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Param('absenceId') absenceId: string,
    @Request() req,
  ) {
    return this.planningService.removeAbsence(projectId, planningId, absenceId, req.user.sub);
  }

  // ── Participants ───────────────────────────────────────────────────────────
  @Post(':id/participants')
  addParticipant(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Body() dto: AddParticipantDto,
    @Request() req,
  ) {
    return this.planningService.addParticipant(projectId, planningId, dto, req.user.sub);
  }

  @Delete(':id/participants/:participantId')
  removeParticipant(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Param('participantId') participantId: string,
    @Request() req,
  ) {
    return this.planningService.removeParticipant(projectId, planningId, participantId, req.user.sub);
  }

  @Post(':id/participants/commit')
  commitParticipant(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Body() dto: CommitParticipantDto,
    @Request() req,
  ) {
    return this.planningService.commitParticipant(projectId, planningId, dto, req.user.sub);
  }

  // ── Push to Sprint ─────────────────────────────────────────────────────────
  @Post(':id/push-to-sprint')
  pushToSprint(
    @Param('projectId') projectId: string,
    @Param('id') planningId: string,
    @Request() req,
  ) {
    return this.planningService.pushToSprint(projectId, planningId, req.user.sub);
  }
}
