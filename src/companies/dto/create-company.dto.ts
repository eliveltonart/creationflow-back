import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  customFields?: any;
}