import {
  IsString, IsOptional, IsBoolean, IsNumber, IsEnum, IsDateString, IsInt, Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ContractType {
  CLT = 'CLT',
  PJ = 'PJ',
  FREELANCER = 'FREELANCER',
  INTERN = 'INTERN',
  APPRENTICE = 'APPRENTICE',
  TEMPORARY = 'TEMPORARY',
}

export enum EmployerStatus {
  PRE_ONBOARDING = 'PRE_ONBOARDING',
  ONBOARDING = 'ONBOARDING',
  ACTIVE = 'ACTIVE',
  OFFBOARDING = 'OFFBOARDING',
  INACTIVE = 'INACTIVE',
}

export enum WorkRegime {
  IN_PERSON = 'IN_PERSON',
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
}

export enum WorkModality {
  IN_PERSON = 'IN_PERSON',
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID',
}

export enum CompanyRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  HR_MANAGER = 'HR_MANAGER',
  FINANCE_MANAGER = 'FINANCE_MANAGER',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  TEAM_LEAD = 'TEAM_LEAD',
  SENIOR_MEMBER = 'SENIOR_MEMBER',
  MEMBER = 'MEMBER',
  JUNIOR_MEMBER = 'JUNIOR_MEMBER',
  CONTRACTOR = 'CONTRACTOR',
  VIEWER = 'VIEWER',
}

export enum SkillType {
  TECHNICAL = 'TECHNICAL',
  BEHAVIORAL = 'BEHAVIORAL',
  LANGUAGE = 'LANGUAGE',
  TOOL = 'TOOL',
}

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

// ── Department ────────────────────────────────────────────────────────────────

export class CreateDepartmentDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsString()
  managerId?: string;
}

export class UpdateDepartmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  parentId?: string;

  @IsOptional()
  @IsString()
  managerId?: string;

  @IsOptional()
  @IsString()
  status?: string;
}

// ── Position ──────────────────────────────────────────────────────────────────

export class CreatePositionDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;
}

export class UpdatePositionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

// ── Employer ──────────────────────────────────────────────────────────────────

export class CreateEmployerDto {
  @IsString()
  fullName: string;

  @IsString()
  emailCorporate: string;

  @IsOptional()
  @IsString()
  socialName?: string;

  @IsOptional()
  @IsString()
  emailPersonal?: string;

  @IsOptional()
  @IsString()
  phonePersonal?: string;

  @IsOptional()
  @IsString()
  phoneCorporate?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  rg?: string;

  // Address
  @IsOptional()
  @IsString()
  addressCep?: string;

  @IsOptional()
  @IsString()
  addressStreet?: string;

  @IsOptional()
  @IsString()
  addressNumber?: string;

  @IsOptional()
  @IsString()
  addressComplement?: string;

  @IsOptional()
  @IsString()
  addressNeighborhood?: string;

  @IsOptional()
  @IsString()
  addressCity?: string;

  @IsOptional()
  @IsString()
  addressState?: string;

  @IsOptional()
  @IsString()
  addressCountry?: string;

  // Emergency
  @IsOptional()
  @IsString()
  emergencyName?: string;

  @IsOptional()
  @IsString()
  emergencyRelation?: string;

  @IsOptional()
  @IsString()
  emergencyPhone?: string;

  // Professional
  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType;

  @IsOptional()
  @IsDateString()
  admissionDate?: string;

  @IsOptional()
  @IsDateString()
  terminationDate?: string;

  @IsOptional()
  @IsEnum(EmployerStatus)
  status?: EmployerStatus;

  @IsOptional()
  @IsEnum(WorkRegime)
  workRegime?: WorkRegime;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  weeklyHours?: number;

  @IsOptional()
  @IsEnum(WorkModality)
  workModality?: WorkModality;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  positionId?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  managerId?: string;

  // Compensation
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  salary?: number;

  @IsOptional()
  @IsString()
  salaryCurrency?: string;

  @IsOptional()
  @IsString()
  salaryPeriod?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  hourlyRate?: number;

  // Link to platform user
  @IsOptional()
  @IsString()
  userId?: string;
}

export class UpdateEmployerDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  emailCorporate?: string;

  @IsOptional()
  @IsString()
  socialName?: string;

  @IsOptional()
  @IsString()
  emailPersonal?: string;

  @IsOptional()
  @IsString()
  phonePersonal?: string;

  @IsOptional()
  @IsString()
  phoneCorporate?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  cpf?: string;

  @IsOptional()
  @IsString()
  rg?: string;

  @IsOptional()
  @IsString()
  addressCep?: string;

  @IsOptional()
  @IsString()
  addressStreet?: string;

  @IsOptional()
  @IsString()
  addressNumber?: string;

  @IsOptional()
  @IsString()
  addressComplement?: string;

  @IsOptional()
  @IsString()
  addressNeighborhood?: string;

  @IsOptional()
  @IsString()
  addressCity?: string;

  @IsOptional()
  @IsString()
  addressState?: string;

  @IsOptional()
  @IsString()
  addressCountry?: string;

  @IsOptional()
  @IsString()
  emergencyName?: string;

  @IsOptional()
  @IsString()
  emergencyRelation?: string;

  @IsOptional()
  @IsString()
  emergencyPhone?: string;

  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType;

  @IsOptional()
  @IsDateString()
  admissionDate?: string;

  @IsOptional()
  @IsDateString()
  terminationDate?: string;

  @IsOptional()
  @IsEnum(EmployerStatus)
  status?: EmployerStatus;

  @IsOptional()
  @IsEnum(WorkRegime)
  workRegime?: WorkRegime;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  weeklyHours?: number;

  @IsOptional()
  @IsEnum(WorkModality)
  workModality?: WorkModality;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  positionId?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  managerId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  salary?: number;

  @IsOptional()
  @IsString()
  salaryCurrency?: string;

  @IsOptional()
  @IsString()
  salaryPeriod?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  hourlyRate?: number;

  @IsOptional()
  @IsString()
  userId?: string;
}

// ── Skill ─────────────────────────────────────────────────────────────────────

export class CreateSkillDto {
  @IsString()
  skillName: string;

  @IsOptional()
  @IsEnum(SkillType)
  skillType?: SkillType;

  @IsOptional()
  @IsEnum(SkillLevel)
  level?: SkillLevel;

  @IsOptional()
  @IsBoolean()
  isCertified?: boolean;
}

// ── Role ──────────────────────────────────────────────────────────────────────

export class AssignRoleDto {
  @IsEnum(CompanyRole)
  role: CompanyRole;
}
