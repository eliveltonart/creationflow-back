import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class ConnectRepoDto {
  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  repoFullName: string; // "owner/repo"

  @IsString()
  @IsOptional()
  defaultBranch?: string;

  @IsString()
  @IsOptional()
  accessToken?: string; // GitHub PAT

  @IsString()
  @IsOptional()
  prOpenedStatus?: string; // TaskStatus value

  @IsString()
  @IsOptional()
  prMergedStatus?: string; // TaskStatus value

  @IsString()
  @IsOptional()
  prClosedStatus?: string; // TaskStatus value or null
}
