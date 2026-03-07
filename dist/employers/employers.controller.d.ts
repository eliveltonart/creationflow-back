import { EmployersService } from './employers.service';
import { CreateDepartmentDto, UpdateDepartmentDto, CreatePositionDto, UpdatePositionDto, CreateEmployerDto, UpdateEmployerDto, CreateSkillDto, AssignRoleDto } from './dto/employer.dto';
export declare class EmployersController {
    private readonly service;
    constructor(service: EmployersService);
    getCompanies(req: any): Promise<{
        name: string;
        id: string;
        color: string;
    }[]>;
    getDepartments(companyId: string, req: any): Promise<({
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
    createDepartment(companyId: string, dto: CreateDepartmentDto, req: any): Promise<{
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
    updateDepartment(companyId: string, deptId: string, dto: UpdateDepartmentDto, req: any): Promise<{
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
    deleteDepartment(companyId: string, deptId: string, req: any): Promise<{
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
    getPositions(companyId: string, req: any): Promise<({
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
    createPosition(companyId: string, dto: CreatePositionDto, req: any): Promise<{
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
    updatePosition(companyId: string, posId: string, dto: UpdatePositionDto, req: any): Promise<{
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
    deletePosition(companyId: string, posId: string, req: any): Promise<{
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
    listMembers(companyId: string, req: any, departmentId?: string, status?: string, contractType?: string, search?: string): Promise<{
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
    getOrCreateProfile(companyId: string, memberUserId: string, req: any): Promise<{
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
    listEmployers(companyId: string, req: any, departmentId?: string, status?: string, contractType?: string, search?: string): Promise<({
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
    getEmployer(companyId: string, employerId: string, req: any): Promise<{
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
    createEmployer(companyId: string, dto: CreateEmployerDto, req: any): Promise<{
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
    updateEmployer(companyId: string, employerId: string, dto: UpdateEmployerDto, req: any): Promise<{
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
    deleteEmployer(companyId: string, employerId: string, req: any): Promise<{
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
    addSkill(companyId: string, employerId: string, dto: CreateSkillDto, req: any): Promise<{
        level: import(".prisma/client").$Enums.SkillLevel;
        id: string;
        createdAt: Date;
        skillName: string;
        skillType: import(".prisma/client").$Enums.SkillType;
        isCertified: boolean;
        employerId: string;
    }>;
    removeSkill(companyId: string, employerId: string, skillId: string, req: any): Promise<{
        level: import(".prisma/client").$Enums.SkillLevel;
        id: string;
        createdAt: Date;
        skillName: string;
        skillType: import(".prisma/client").$Enums.SkillType;
        isCertified: boolean;
        employerId: string;
    }>;
    assignRole(companyId: string, employerId: string, dto: AssignRoleDto, req: any): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.CompanyRole;
        companyId: string;
        employerId: string;
        grantedBy: string | null;
        grantedAt: Date;
        revokedAt: Date | null;
    }>;
    revokeRole(companyId: string, employerId: string, roleId: string, req: any): Promise<{
        id: string;
        role: import(".prisma/client").$Enums.CompanyRole;
        companyId: string;
        employerId: string;
        grantedBy: string | null;
        grantedAt: Date;
        revokedAt: Date | null;
    }>;
}
