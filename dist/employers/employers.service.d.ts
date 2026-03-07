import { PrismaService } from '../database/prisma.service';
import { CreateDepartmentDto, UpdateDepartmentDto, CreatePositionDto, UpdatePositionDto, CreateEmployerDto, UpdateEmployerDto, CreateSkillDto, AssignRoleDto } from './dto/employer.dto';
export declare class EmployersService {
    private prisma;
    constructor(prisma: PrismaService);
    private assertAccess;
    private assertOwner;
    getAccessibleCompanies(userId: string): Promise<{
        name: string;
        id: string;
        color: string;
    }[]>;
    getDepartments(companyId: string, userId: string): Promise<({
        _count: {
            employers: number;
        };
        parent: {
            name: string;
            id: string;
        };
        children: {
            name: string;
            id: string;
        }[];
        manager: {
            id: string;
            fullName: string;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        status: string;
        parentId: string | null;
        managerId: string | null;
    })[]>;
    createDepartment(companyId: string, dto: CreateDepartmentDto, userId: string): Promise<{
        _count: {
            employers: number;
        };
        parent: {
            name: string;
            id: string;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        status: string;
        parentId: string | null;
        managerId: string | null;
    }>;
    updateDepartment(companyId: string, deptId: string, dto: UpdateDepartmentDto, userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        status: string;
        parentId: string | null;
        managerId: string | null;
    }>;
    deleteDepartment(companyId: string, deptId: string, userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        status: string;
        parentId: string | null;
        managerId: string | null;
    }>;
    getPositions(companyId: string, userId: string): Promise<({
        department: {
            name: string;
            id: string;
        };
        _count: {
            employers: number;
        };
    } & {
        level: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        isActive: boolean;
        departmentId: string | null;
    })[]>;
    createPosition(companyId: string, dto: CreatePositionDto, userId: string): Promise<{
        department: {
            name: string;
            id: string;
        };
    } & {
        level: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        isActive: boolean;
        departmentId: string | null;
    }>;
    updatePosition(companyId: string, posId: string, dto: UpdatePositionDto, userId: string): Promise<{
        level: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        isActive: boolean;
        departmentId: string | null;
    }>;
    deletePosition(companyId: string, posId: string, userId: string): Promise<{
        level: string | null;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        companyId: string;
        isActive: boolean;
        departmentId: string | null;
    }>;
    listMembers(companyId: string, userId: string, filters: {
        departmentId?: string;
        status?: string;
        contractType?: string;
        search?: string;
    }): Promise<{
        userId: string;
        memberRole: import(".prisma/client").$Enums.MemberRole;
        user: {
            email: string;
            name: string;
            id: string;
        };
        profile: {
            user: {
                email: string;
                name: string;
                id: string;
            };
            department: {
                name: string;
                id: string;
            };
            position: {
                level: string;
                name: string;
                id: string;
            };
            _count: {
                reports: number;
            };
            manager: {
                id: string;
                fullName: string;
                emailCorporate: string;
            };
            roles: {
                id: string;
                role: import(".prisma/client").$Enums.CompanyRole;
                companyId: string;
                employerId: string;
                grantedBy: string | null;
                grantedAt: Date;
                revokedAt: Date | null;
            }[];
            skills: {
                level: import(".prisma/client").$Enums.SkillLevel;
                id: string;
                createdAt: Date;
                skillName: string;
                skillType: import(".prisma/client").$Enums.SkillType;
                isCertified: boolean;
                employerId: string;
            }[];
        } & {
            level: string | null;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            companyId: string;
            status: import(".prisma/client").$Enums.EmployerStatus;
            managerId: string | null;
            departmentId: string | null;
            fullName: string;
            emailCorporate: string;
            socialName: string | null;
            emailPersonal: string | null;
            phonePersonal: string | null;
            phoneCorporate: string | null;
            birthDate: Date | null;
            gender: string | null;
            nationality: string | null;
            cpf: string | null;
            rg: string | null;
            addressCep: string | null;
            addressStreet: string | null;
            addressNumber: string | null;
            addressComplement: string | null;
            addressNeighborhood: string | null;
            addressCity: string | null;
            addressState: string | null;
            addressCountry: string | null;
            emergencyName: string | null;
            emergencyRelation: string | null;
            emergencyPhone: string | null;
            contractType: import(".prisma/client").$Enums.ContractType;
            admissionDate: Date;
            terminationDate: Date | null;
            workRegime: import(".prisma/client").$Enums.WorkRegime;
            weeklyHours: number;
            workModality: import(".prisma/client").$Enums.WorkModality;
            positionId: string | null;
            salary: number | null;
            salaryCurrency: string | null;
            salaryPeriod: string | null;
            hourlyRate: number | null;
        };
    }[]>;
    getOrCreateProfile(companyId: string, memberUserId: string, requestingUserId: string): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        };
        department: {
            name: string;
            id: string;
        };
        position: {
            level: string;
            name: string;
            id: string;
        };
        _count: {
            reports: number;
        };
        manager: {
            id: string;
            fullName: string;
            emailCorporate: string;
        };
        reports: {
            id: string;
            fullName: string;
        }[];
        roles: {
            id: string;
            role: import(".prisma/client").$Enums.CompanyRole;
            companyId: string;
            employerId: string;
            grantedBy: string | null;
            grantedAt: Date;
            revokedAt: Date | null;
        }[];
        skills: {
            level: import(".prisma/client").$Enums.SkillLevel;
            id: string;
            createdAt: Date;
            skillName: string;
            skillType: import(".prisma/client").$Enums.SkillType;
            isCertified: boolean;
            employerId: string;
        }[];
    } & {
        level: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        companyId: string;
        status: import(".prisma/client").$Enums.EmployerStatus;
        managerId: string | null;
        departmentId: string | null;
        fullName: string;
        emailCorporate: string;
        socialName: string | null;
        emailPersonal: string | null;
        phonePersonal: string | null;
        phoneCorporate: string | null;
        birthDate: Date | null;
        gender: string | null;
        nationality: string | null;
        cpf: string | null;
        rg: string | null;
        addressCep: string | null;
        addressStreet: string | null;
        addressNumber: string | null;
        addressComplement: string | null;
        addressNeighborhood: string | null;
        addressCity: string | null;
        addressState: string | null;
        addressCountry: string | null;
        emergencyName: string | null;
        emergencyRelation: string | null;
        emergencyPhone: string | null;
        contractType: import(".prisma/client").$Enums.ContractType;
        admissionDate: Date;
        terminationDate: Date | null;
        workRegime: import(".prisma/client").$Enums.WorkRegime;
        weeklyHours: number;
        workModality: import(".prisma/client").$Enums.WorkModality;
        positionId: string | null;
        salary: number | null;
        salaryCurrency: string | null;
        salaryPeriod: string | null;
        hourlyRate: number | null;
    }>;
    listEmployers(companyId: string, userId: string, filters: {
        departmentId?: string;
        status?: string;
        contractType?: string;
        search?: string;
    }): Promise<({
        user: {
            email: string;
            name: string;
            id: string;
        };
        department: {
            name: string;
            id: string;
        };
        position: {
            level: string;
            name: string;
            id: string;
        };
        _count: {
            reports: number;
        };
        manager: {
            id: string;
            fullName: string;
            emailCorporate: string;
        };
        roles: {
            id: string;
            role: import(".prisma/client").$Enums.CompanyRole;
            companyId: string;
            employerId: string;
            grantedBy: string | null;
            grantedAt: Date;
            revokedAt: Date | null;
        }[];
        skills: {
            level: import(".prisma/client").$Enums.SkillLevel;
            id: string;
            createdAt: Date;
            skillName: string;
            skillType: import(".prisma/client").$Enums.SkillType;
            isCertified: boolean;
            employerId: string;
        }[];
    } & {
        level: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        companyId: string;
        status: import(".prisma/client").$Enums.EmployerStatus;
        managerId: string | null;
        departmentId: string | null;
        fullName: string;
        emailCorporate: string;
        socialName: string | null;
        emailPersonal: string | null;
        phonePersonal: string | null;
        phoneCorporate: string | null;
        birthDate: Date | null;
        gender: string | null;
        nationality: string | null;
        cpf: string | null;
        rg: string | null;
        addressCep: string | null;
        addressStreet: string | null;
        addressNumber: string | null;
        addressComplement: string | null;
        addressNeighborhood: string | null;
        addressCity: string | null;
        addressState: string | null;
        addressCountry: string | null;
        emergencyName: string | null;
        emergencyRelation: string | null;
        emergencyPhone: string | null;
        contractType: import(".prisma/client").$Enums.ContractType;
        admissionDate: Date;
        terminationDate: Date | null;
        workRegime: import(".prisma/client").$Enums.WorkRegime;
        weeklyHours: number;
        workModality: import(".prisma/client").$Enums.WorkModality;
        positionId: string | null;
        salary: number | null;
        salaryCurrency: string | null;
        salaryPeriod: string | null;
        hourlyRate: number | null;
    })[]>;
    getEmployer(companyId: string, employerId: string, userId: string): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        };
        department: {
            name: string;
            id: string;
        };
        position: {
            level: string;
            name: string;
            id: string;
        };
        _count: {
            reports: number;
        };
        manager: {
            id: string;
            fullName: string;
            emailCorporate: string;
        };
        reports: {
            id: string;
            fullName: string;
            emailCorporate: string;
        }[];
        roles: {
            id: string;
            role: import(".prisma/client").$Enums.CompanyRole;
            companyId: string;
            employerId: string;
            grantedBy: string | null;
            grantedAt: Date;
            revokedAt: Date | null;
        }[];
        skills: {
            level: import(".prisma/client").$Enums.SkillLevel;
            id: string;
            createdAt: Date;
            skillName: string;
            skillType: import(".prisma/client").$Enums.SkillType;
            isCertified: boolean;
            employerId: string;
        }[];
    } & {
        level: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        companyId: string;
        status: import(".prisma/client").$Enums.EmployerStatus;
        managerId: string | null;
        departmentId: string | null;
        fullName: string;
        emailCorporate: string;
        socialName: string | null;
        emailPersonal: string | null;
        phonePersonal: string | null;
        phoneCorporate: string | null;
        birthDate: Date | null;
        gender: string | null;
        nationality: string | null;
        cpf: string | null;
        rg: string | null;
        addressCep: string | null;
        addressStreet: string | null;
        addressNumber: string | null;
        addressComplement: string | null;
        addressNeighborhood: string | null;
        addressCity: string | null;
        addressState: string | null;
        addressCountry: string | null;
        emergencyName: string | null;
        emergencyRelation: string | null;
        emergencyPhone: string | null;
        contractType: import(".prisma/client").$Enums.ContractType;
        admissionDate: Date;
        terminationDate: Date | null;
        workRegime: import(".prisma/client").$Enums.WorkRegime;
        weeklyHours: number;
        workModality: import(".prisma/client").$Enums.WorkModality;
        positionId: string | null;
        salary: number | null;
        salaryCurrency: string | null;
        salaryPeriod: string | null;
        hourlyRate: number | null;
    }>;
    createEmployer(companyId: string, dto: CreateEmployerDto, userId: string): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        };
        department: {
            name: string;
            id: string;
        };
        position: {
            level: string;
            name: string;
            id: string;
        };
        _count: {
            reports: number;
        };
        manager: {
            id: string;
            fullName: string;
            emailCorporate: string;
        };
        roles: {
            id: string;
            role: import(".prisma/client").$Enums.CompanyRole;
            companyId: string;
            employerId: string;
            grantedBy: string | null;
            grantedAt: Date;
            revokedAt: Date | null;
        }[];
        skills: {
            level: import(".prisma/client").$Enums.SkillLevel;
            id: string;
            createdAt: Date;
            skillName: string;
            skillType: import(".prisma/client").$Enums.SkillType;
            isCertified: boolean;
            employerId: string;
        }[];
    } & {
        level: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        companyId: string;
        status: import(".prisma/client").$Enums.EmployerStatus;
        managerId: string | null;
        departmentId: string | null;
        fullName: string;
        emailCorporate: string;
        socialName: string | null;
        emailPersonal: string | null;
        phonePersonal: string | null;
        phoneCorporate: string | null;
        birthDate: Date | null;
        gender: string | null;
        nationality: string | null;
        cpf: string | null;
        rg: string | null;
        addressCep: string | null;
        addressStreet: string | null;
        addressNumber: string | null;
        addressComplement: string | null;
        addressNeighborhood: string | null;
        addressCity: string | null;
        addressState: string | null;
        addressCountry: string | null;
        emergencyName: string | null;
        emergencyRelation: string | null;
        emergencyPhone: string | null;
        contractType: import(".prisma/client").$Enums.ContractType;
        admissionDate: Date;
        terminationDate: Date | null;
        workRegime: import(".prisma/client").$Enums.WorkRegime;
        weeklyHours: number;
        workModality: import(".prisma/client").$Enums.WorkModality;
        positionId: string | null;
        salary: number | null;
        salaryCurrency: string | null;
        salaryPeriod: string | null;
        hourlyRate: number | null;
    }>;
    updateEmployer(companyId: string, employerId: string, dto: UpdateEmployerDto, userId: string): Promise<{
        user: {
            email: string;
            name: string;
            id: string;
        };
        department: {
            name: string;
            id: string;
        };
        position: {
            level: string;
            name: string;
            id: string;
        };
        _count: {
            reports: number;
        };
        manager: {
            id: string;
            fullName: string;
            emailCorporate: string;
        };
        roles: {
            id: string;
            role: import(".prisma/client").$Enums.CompanyRole;
            companyId: string;
            employerId: string;
            grantedBy: string | null;
            grantedAt: Date;
            revokedAt: Date | null;
        }[];
        skills: {
            level: import(".prisma/client").$Enums.SkillLevel;
            id: string;
            createdAt: Date;
            skillName: string;
            skillType: import(".prisma/client").$Enums.SkillType;
            isCertified: boolean;
            employerId: string;
        }[];
    } & {
        level: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        companyId: string;
        status: import(".prisma/client").$Enums.EmployerStatus;
        managerId: string | null;
        departmentId: string | null;
        fullName: string;
        emailCorporate: string;
        socialName: string | null;
        emailPersonal: string | null;
        phonePersonal: string | null;
        phoneCorporate: string | null;
        birthDate: Date | null;
        gender: string | null;
        nationality: string | null;
        cpf: string | null;
        rg: string | null;
        addressCep: string | null;
        addressStreet: string | null;
        addressNumber: string | null;
        addressComplement: string | null;
        addressNeighborhood: string | null;
        addressCity: string | null;
        addressState: string | null;
        addressCountry: string | null;
        emergencyName: string | null;
        emergencyRelation: string | null;
        emergencyPhone: string | null;
        contractType: import(".prisma/client").$Enums.ContractType;
        admissionDate: Date;
        terminationDate: Date | null;
        workRegime: import(".prisma/client").$Enums.WorkRegime;
        weeklyHours: number;
        workModality: import(".prisma/client").$Enums.WorkModality;
        positionId: string | null;
        salary: number | null;
        salaryCurrency: string | null;
        salaryPeriod: string | null;
        hourlyRate: number | null;
    }>;
    deleteEmployer(companyId: string, employerId: string, userId: string): Promise<{
        level: string | null;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string | null;
        companyId: string;
        status: import(".prisma/client").$Enums.EmployerStatus;
        managerId: string | null;
        departmentId: string | null;
        fullName: string;
        emailCorporate: string;
        socialName: string | null;
        emailPersonal: string | null;
        phonePersonal: string | null;
        phoneCorporate: string | null;
        birthDate: Date | null;
        gender: string | null;
        nationality: string | null;
        cpf: string | null;
        rg: string | null;
        addressCep: string | null;
        addressStreet: string | null;
        addressNumber: string | null;
        addressComplement: string | null;
        addressNeighborhood: string | null;
        addressCity: string | null;
        addressState: string | null;
        addressCountry: string | null;
        emergencyName: string | null;
        emergencyRelation: string | null;
        emergencyPhone: string | null;
        contractType: import(".prisma/client").$Enums.ContractType;
        admissionDate: Date;
        terminationDate: Date | null;
        workRegime: import(".prisma/client").$Enums.WorkRegime;
        weeklyHours: number;
        workModality: import(".prisma/client").$Enums.WorkModality;
        positionId: string | null;
        salary: number | null;
        salaryCurrency: string | null;
        salaryPeriod: string | null;
        hourlyRate: number | null;
    }>;
    addSkill(companyId: string, employerId: string, dto: CreateSkillDto, userId: string): Promise<{
        level: import(".prisma/client").$Enums.SkillLevel;
        id: string;
        createdAt: Date;
        skillName: string;
        skillType: import(".prisma/client").$Enums.SkillType;
        isCertified: boolean;
        employerId: string;
    }>;
    removeSkill(companyId: string, employerId: string, skillId: string, userId: string): Promise<{
        level: import(".prisma/client").$Enums.SkillLevel;
        id: string;
        createdAt: Date;
        skillName: string;
        skillType: import(".prisma/client").$Enums.SkillType;
        isCertified: boolean;
        employerId: string;
    }>;
    assignRole(companyId: string, employerId: string, dto: AssignRoleDto, userId: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.CompanyRole;
        companyId: string;
        employerId: string;
        grantedBy: string | null;
        grantedAt: Date;
        revokedAt: Date | null;
    }>;
    revokeRole(companyId: string, employerId: string, roleId: string, userId: string): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.CompanyRole;
        companyId: string;
        employerId: string;
        grantedBy: string | null;
        grantedAt: Date;
        revokedAt: Date | null;
    }>;
}
