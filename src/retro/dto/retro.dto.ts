import {
  IsString, IsOptional, IsBoolean, IsNumber, IsEnum, IsInt, Min, Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum RetroStatus {
  DRAFT = 'DRAFT',
  COLECT = 'COLECT',
  VOTE = 'VOTE',
  ACT = 'ACT',
  CLOSED = 'CLOSED',
}

export enum RetroCardCategory {
  WENT_WELL = 'WENT_WELL',
  NEEDS_IMPROVEMENT = 'NEEDS_IMPROVEMENT',
  ACTION_ITEMS = 'ACTION_ITEMS',
}

export class CreateRetroDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  projectId: string;

  @IsOptional()
  @IsString()
  sprintId?: string;

  @IsOptional()
  @IsString()
  taskId?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  @Type(() => Number)
  voteLimit?: number;

  @IsOptional()
  @IsString()
  col1Name?: string;

  @IsOptional()
  @IsString()
  col1Color?: string;

  @IsOptional()
  @IsString()
  col2Name?: string;

  @IsOptional()
  @IsString()
  col2Color?: string;

  @IsOptional()
  @IsString()
  col3Name?: string;

  @IsOptional()
  @IsString()
  col3Color?: string;
}

export class UpdateRetroDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  col1Name?: string;

  @IsOptional()
  @IsString()
  col1Color?: string;

  @IsOptional()
  @IsString()
  col2Name?: string;

  @IsOptional()
  @IsString()
  col2Color?: string;

  @IsOptional()
  @IsString()
  col3Name?: string;

  @IsOptional()
  @IsString()
  col3Color?: string;

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  @Type(() => Number)
  voteLimit?: number;
}

export class AdvancePhaseDto {}

export class CreateCardDto {
  @IsString()
  content: string;

  @IsEnum(RetroCardCategory)
  category: RetroCardCategory;

  @IsOptional()
  @IsString()
  guestId?: string;

  @IsOptional()
  @IsString()
  guestName?: string;

  @IsOptional()
  @IsString()
  authorName?: string;
}

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(RetroCardCategory)
  category?: RetroCardCategory;
}

export class VoteCardDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  points?: number;

  @IsOptional()
  @IsString()
  guestId?: string;
}

export class CreateActionDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsString()
  cardId: string;

  @IsOptional()
  @IsBoolean()
  createTask?: boolean;

  @IsOptional()
  @IsString()
  taskProjectId?: string;

  @IsOptional()
  @IsString()
  taskSprintId?: string;
}

export class JoinRetroDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  guestId?: string;
}
