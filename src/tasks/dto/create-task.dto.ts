import { IsString, IsOptional, IsEnum, IsInt, IsDateString, IsArray, Min } from 'class-validator';
import { TaskType, TaskStatus, Priority } from '@prisma/client';
// Priority enum: LOW | MEDIUM | HIGH | URGENT

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  projectId: string;

  @IsOptional()
  @IsEnum(TaskType)
  type?: TaskType;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsInt()
  @Min(0)
  storyPoints?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  estimatedHours?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsString()
  sprintId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  assignees?: { name: string; userId?: string }[];

  @IsOptional()
  @IsArray()
  prValidators?: { name: string; userId?: string }[];

  @IsOptional()
  @IsArray()
  testers?: { name: string; userId?: string }[];

  @IsOptional()
  @IsArray()
  dod?: { text: string; completed: boolean }[];

  @IsOptional()
  @IsString()
  backlogItemId?: string;
}
