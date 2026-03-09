import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsDateString,
  IsEnum,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { IntruderType, RefinementStatus } from '@prisma/client';

export class CreatePlanningDto {
  @IsString()
  name: string;

  @IsString()
  projectId: string;

  @IsString()
  sprintId: string;

  @IsString()
  facilitatorId: string;

  @IsArray()
  @IsString({ each: true })
  participantIds: string[];

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsNumber()
  @IsOptional()
  durationMinutes?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdatePlanningDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  sprintGoal?: string;

  @IsString()
  @IsOptional()
  facilitatorId?: string;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsNumber()
  @IsOptional()
  durationMinutes?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  closingNotes?: string;
}

export class AdvanceStepDto {
  @IsNumber()
  @Min(1)
  @Max(7)
  step: number;
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

export class AddPlanningTaskDto {
  @IsString()
  taskId: string;

  @IsBoolean()
  @IsOptional()
  isDesignTask?: boolean;

  @IsString()
  @IsOptional()
  handoffId?: string;
}

export class UpdatePlanningTaskDto {
  @IsNumber()
  @IsOptional()
  storyPointsFinal?: number;

  @IsNumber()
  @IsOptional()
  hoursEstimated?: number;

  @IsString()
  @IsOptional()
  assigneeId?: string;

  @IsEnum(RefinementStatus)
  @IsOptional()
  refinementStatus?: RefinementStatus;

  @IsString()
  @IsOptional()
  refinementNotes?: string;

  @IsBoolean()
  @IsOptional()
  isDesignTask?: boolean;

  @IsString()
  @IsOptional()
  handoffId?: string;
}

// ── Votes ─────────────────────────────────────────────────────────────────────

export class CastVoteDto {
  @IsString()
  planningTaskId: string;

  @IsString()
  voterId: string;

  @IsString()
  voteValue: string; // '1','2','3','5','8','13','21','?','coffee'

  @IsNumber()
  @IsOptional()
  round?: number;
}

export class RevealVotesDto {
  @IsString()
  planningTaskId: string;

  @IsNumber()
  @IsOptional()
  round?: number;
}

export class ResetVotesDto {
  @IsString()
  planningTaskId: string;
}

// ── Capacity ──────────────────────────────────────────────────────────────────

export class CreateRiteDto {
  @IsString()
  name: string;

  @IsNumber()
  frequencyPerSprint: number;

  @IsNumber()
  durationMinutes: number;

  @IsNumber()
  participantsCount: number;
}

export class CreateIntruderDto {
  @IsEnum(IntruderType)
  type: IntruderType;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  estimatedHours: number;
}

export class CreateAbsenceDto {
  @IsString()
  employerId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsNumber()
  hours: number;
}

// ── Participants ──────────────────────────────────────────────────────────────

export class CommitParticipantDto {
  @IsString()
  employerId: string;
}

export class AddParticipantDto {
  @IsString()
  employerId: string;
}
