import {
  IsEmail,
  IsOptional,
  IsBoolean,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';

export class AdminCreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsBoolean()
  @IsOptional()
  isSuperAdmin?: boolean;
}

export class AdminUpdateUserDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  isSuperAdmin?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class AdminSetFeatureFlagDto {
  @IsString()
  feature: string;

  @IsBoolean()
  enabled: boolean;
}

export class AdminQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  page?: string;

  @IsString()
  @IsOptional()
  limit?: string;
}
