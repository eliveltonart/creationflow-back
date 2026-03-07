import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';

export enum HandoffStatus {
  DRAFT = 'DRAFT',
  READY = 'READY',
  IMPLEMENTING = 'IMPLEMENTING',
  IMPLEMENTED = 'IMPLEMENTED',
  APPROVED = 'APPROVED',
  ARCHIVED = 'ARCHIVED',
}

export class CreateHandoffDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  projectId: string;

  @IsOptional()
  @IsString()
  developerId?: string;

  @IsOptional()
  @IsString()
  rationale?: string;

  @IsOptional()
  @IsString()
  userJourneyContext?: string;
}

export class UpdateHandoffDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  developerId?: string;

  @IsOptional()
  @IsString()
  rationale?: string;

  @IsOptional()
  @IsString()
  userJourneyContext?: string;

  // Gaps
  @IsOptional() gapValidationErrors?: boolean;
  @IsOptional() gapValidationErrorsNA?: boolean;
  @IsOptional() gapErrorPages?: boolean;
  @IsOptional() gapErrorPagesNA?: boolean;
  @IsOptional() gapAlerts?: boolean;
  @IsOptional() gapAlertsNA?: boolean;
  @IsOptional() gapLoadingStates?: boolean;
  @IsOptional() gapLoadingStatesNA?: boolean;
  @IsOptional() gapEmptyStates?: boolean;
  @IsOptional() gapEmptyStatesNA?: boolean;
  @IsOptional() gapComponentStates?: boolean;
  @IsOptional() gapComponentStatesNA?: boolean;
  @IsOptional() gapPasswordReset?: boolean;
  @IsOptional() gapPasswordResetNA?: boolean;
  @IsOptional() gapResponsive?: boolean;
  @IsOptional() gapResponsiveNA?: boolean;
}

export class UpdateHandoffStatusDto {
  @IsEnum(HandoffStatus)
  status: HandoffStatus;
}

export class CreateComponentDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  usage?: string;

  @IsOptional()
  @IsString()
  figmaLink?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  variants?: any[];

  @IsOptional()
  states?: any[];

  @IsOptional()
  styles?: any[];

  @IsOptional()
  responsiveSpecs?: any;

  @IsOptional()
  @IsString()
  accessibilityNotes?: string;

  @IsOptional()
  @IsString()
  wcagLevel?: string;

  @IsOptional()
  codeSnippets?: any[];

  @IsOptional()
  order?: number;
}

export class UpdateComponentDto extends CreateComponentDto {}

export class CreateCommentDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  componentId?: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}

export class LinkTaskDto {
  @IsArray()
  @IsString({ each: true })
  taskIds: string[];
}
