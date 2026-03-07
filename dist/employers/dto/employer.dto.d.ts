export declare enum ContractType {
    CLT = "CLT",
    PJ = "PJ",
    FREELANCER = "FREELANCER",
    INTERN = "INTERN",
    APPRENTICE = "APPRENTICE",
    TEMPORARY = "TEMPORARY"
}
export declare enum EmployerStatus {
    PRE_ONBOARDING = "PRE_ONBOARDING",
    ONBOARDING = "ONBOARDING",
    ACTIVE = "ACTIVE",
    OFFBOARDING = "OFFBOARDING",
    INACTIVE = "INACTIVE"
}
export declare enum WorkRegime {
    IN_PERSON = "IN_PERSON",
    REMOTE = "REMOTE",
    HYBRID = "HYBRID"
}
export declare enum WorkModality {
    IN_PERSON = "IN_PERSON",
    REMOTE = "REMOTE",
    HYBRID = "HYBRID"
}
export declare enum CompanyRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    HR_MANAGER = "HR_MANAGER",
    FINANCE_MANAGER = "FINANCE_MANAGER",
    PROJECT_MANAGER = "PROJECT_MANAGER",
    TEAM_LEAD = "TEAM_LEAD",
    SENIOR_MEMBER = "SENIOR_MEMBER",
    MEMBER = "MEMBER",
    JUNIOR_MEMBER = "JUNIOR_MEMBER",
    CONTRACTOR = "CONTRACTOR",
    VIEWER = "VIEWER"
}
export declare enum SkillType {
    TECHNICAL = "TECHNICAL",
    BEHAVIORAL = "BEHAVIORAL",
    LANGUAGE = "LANGUAGE",
    TOOL = "TOOL"
}
export declare enum SkillLevel {
    BEGINNER = "BEGINNER",
    INTERMEDIATE = "INTERMEDIATE",
    ADVANCED = "ADVANCED",
    EXPERT = "EXPERT"
}
export declare class CreateDepartmentDto {
    name: string;
    description?: string;
    parentId?: string;
    managerId?: string;
}
export declare class UpdateDepartmentDto {
    name?: string;
    description?: string;
    parentId?: string;
    managerId?: string;
    status?: string;
}
export declare class CreatePositionDto {
    name: string;
    description?: string;
    level?: string;
    departmentId?: string;
}
export declare class UpdatePositionDto {
    name?: string;
    description?: string;
    level?: string;
    departmentId?: string;
    isActive?: boolean;
}
export declare class CreateEmployerDto {
    fullName: string;
    emailCorporate: string;
    socialName?: string;
    emailPersonal?: string;
    phonePersonal?: string;
    phoneCorporate?: string;
    birthDate?: string;
    gender?: string;
    nationality?: string;
    cpf?: string;
    rg?: string;
    addressCep?: string;
    addressStreet?: string;
    addressNumber?: string;
    addressComplement?: string;
    addressNeighborhood?: string;
    addressCity?: string;
    addressState?: string;
    addressCountry?: string;
    emergencyName?: string;
    emergencyRelation?: string;
    emergencyPhone?: string;
    contractType?: ContractType;
    admissionDate?: string;
    terminationDate?: string;
    status?: EmployerStatus;
    workRegime?: WorkRegime;
    weeklyHours?: number;
    workModality?: WorkModality;
    departmentId?: string;
    positionId?: string;
    level?: string;
    managerId?: string;
    salary?: number;
    salaryCurrency?: string;
    salaryPeriod?: string;
    hourlyRate?: number;
    userId?: string;
}
export declare class UpdateEmployerDto {
    fullName?: string;
    emailCorporate?: string;
    socialName?: string;
    emailPersonal?: string;
    phonePersonal?: string;
    phoneCorporate?: string;
    birthDate?: string;
    gender?: string;
    nationality?: string;
    cpf?: string;
    rg?: string;
    addressCep?: string;
    addressStreet?: string;
    addressNumber?: string;
    addressComplement?: string;
    addressNeighborhood?: string;
    addressCity?: string;
    addressState?: string;
    addressCountry?: string;
    emergencyName?: string;
    emergencyRelation?: string;
    emergencyPhone?: string;
    contractType?: ContractType;
    admissionDate?: string;
    terminationDate?: string;
    status?: EmployerStatus;
    workRegime?: WorkRegime;
    weeklyHours?: number;
    workModality?: WorkModality;
    departmentId?: string;
    positionId?: string;
    level?: string;
    managerId?: string;
    salary?: number;
    salaryCurrency?: string;
    salaryPeriod?: string;
    hourlyRate?: number;
    userId?: string;
}
export declare class CreateSkillDto {
    skillName: string;
    skillType?: SkillType;
    level?: SkillLevel;
    isCertified?: boolean;
}
export declare class AssignRoleDto {
    role: CompanyRole;
}
