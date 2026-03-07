import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  IsArray,
} from 'class-validator';

export enum ResourceType {
  SITE = 'SITE',
  FTP = 'FTP',
  DATABASE = 'DATABASE',
  LOGIN = 'LOGIN',
  API_KEY = 'API_KEY',
  SSH = 'SSH',
  TOOL = 'TOOL',
}

export enum ResourceVisibility {
  COMPANY = 'COMPANY',
  RESTRICTED = 'RESTRICTED',
}

export class CreateResourceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  favicon?: string;

  @IsEnum(ResourceType)
  type: ResourceType;

  // Plain JSON fields object — will be encrypted before saving
  @IsObject()
  fields: Record<string, any>;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(ResourceVisibility)
  visibility?: ResourceVisibility;

  @IsString()
  companyId: string;

  // User IDs to grant access (only used when visibility = RESTRICTED)
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accessUserIds?: string[];
}
