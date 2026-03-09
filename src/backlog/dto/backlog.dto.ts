import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  IsArray,
  IsDateString,
  Min,
  IsNumber,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

// ── Enums ─────────────────────────────────────────────────────────────────────

export enum BacklogItemType {
  FEATURE = 'FEATURE',
  BUG = 'BUG',
  TECH_DEBT = 'TECH_DEBT',
  RESEARCH = 'RESEARCH',
  DESIGN = 'DESIGN',
  INFRA = 'INFRA',
}

export enum BacklogItemStatus {
  BACKLOG = 'BACKLOG',
  IN_SPRINT = 'IN_SPRINT',
  DONE = 'DONE',
  ARCHIVED = 'ARCHIVED',
}

export enum BacklogRefinementStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  REFINED = 'REFINED',
}

export enum BacklogPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum DependencyType {
  BLOCKS = 'BLOCKS',
  RELATES_TO = 'RELATES_TO',
}

export enum EpicStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

// ── Epic DTOs ─────────────────────────────────────────────────────────────────

export class CreateEpicDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsEnum(EpicStatus)
  status?: EpicStatus;

  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @IsOptional()
  @IsString()
  ownerId?: string;
}

export class UpdateEpicDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsEnum(EpicStatus)
  status?: EpicStatus;

  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

// ── BacklogItem DTOs ──────────────────────────────────────────────────────────

export class CreateBacklogItemDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(BacklogItemType)
  type?: BacklogItemType;

  @IsOptional()
  @IsEnum(BacklogPriority)
  priority?: BacklogPriority;

  @IsOptional()
  @IsInt()
  @Min(0)
  storyPoints?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hoursEstimated?: number;

  @IsOptional()
  @IsString()
  epicId?: string;

  @IsOptional()
  @IsString()
  sprintId?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  externalId?: string;

  /** The Employer ID of the creator (resolved from userId+companyId if omitted) */
  @IsOptional()
  @IsString()
  createdById?: string;
}

export class UpdateBacklogItemDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(BacklogItemType)
  type?: BacklogItemType;

  @IsOptional()
  @IsEnum(BacklogPriority)
  priority?: BacklogPriority;

  @IsOptional()
  @IsEnum(BacklogItemStatus)
  status?: BacklogItemStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  storyPoints?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hoursEstimated?: number;

  @IsOptional()
  @IsString()
  epicId?: string;

  @IsOptional()
  @IsString()
  sprintId?: string;

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  refinementNotes?: string;

  @IsOptional()
  @IsInt()
  orderIndex?: number;
}

export class RefineBacklogItemDto {
  @IsOptional()
  @IsString()
  refinementNotes?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  storyPoints?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hoursEstimated?: number;
}

export class MoveToSprintDto {
  @IsString()
  sprintId: string;
}

export class ReorderItemDto {
  @IsString()
  id: string;

  @IsInt()
  @Min(0)
  orderIndex: number;
}

export class ReorderDto {
  @IsArray()
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}

export class BulkMoveDto {
  @IsArray()
  @IsString({ each: true })
  itemIds: string[];

  @IsString()
  sprintId: string;
}

// ── Acceptance Criteria DTOs ──────────────────────────────────────────────────

export class AddAcceptanceCriteriaDto {
  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}

export class UpdateAcceptanceCriteriaDto {
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isChecked?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}

// ── Dependency DTOs ───────────────────────────────────────────────────────────

export class AddDependencyDto {
  @IsString()
  dependsOnId: string;

  @IsOptional()
  @IsEnum(DependencyType)
  type?: DependencyType;
}

// ── BacklogView DTOs ──────────────────────────────────────────────────────────

export class CreateBacklogViewDto {
  @IsString()
  name: string;

  filters: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isShared?: boolean;
}

export class UpdateBacklogViewDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  filters?: Record<string, any>;

  @IsOptional()
  @IsBoolean()
  isShared?: boolean;
}

// ── Query / Filter DTOs ───────────────────────────────────────────────────────

export class BacklogFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  epicId?: string;

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsEnum(BacklogItemType, { each: true })
  type?: BacklogItemType[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsEnum(BacklogPriority, { each: true })
  priority?: BacklogPriority[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsEnum(BacklogRefinementStatus, { each: true })
  refinementStatus?: BacklogRefinementStatus[];

  @IsOptional()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsEnum(BacklogItemStatus, { each: true })
  status?: BacklogItemStatus[];

  @IsOptional()
  @IsString()
  assigneeId?: string;

  @IsOptional()
  @IsString()
  sprintId?: string;

  /** 'none' to filter items without sprint */
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  noSprint?: boolean;

  /** Group by epic in response */
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  groupByEpic?: boolean;
}
