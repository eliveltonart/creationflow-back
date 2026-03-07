import { IsString, IsOptional } from 'class-validator';

export class UpdateRepoDto {
  @IsString()
  @IsOptional()
  defaultBranch?: string;

  @IsString()
  @IsOptional()
  accessToken?: string;

  @IsString()
  @IsOptional()
  prOpenedStatus?: string;

  @IsString()
  @IsOptional()
  prMergedStatus?: string;

  @IsString()
  @IsOptional()
  prClosedStatus?: string;
}

export class LinkPrToTaskDto {
  @IsString()
  @IsOptional()
  taskId?: string; // null to unlink
}
