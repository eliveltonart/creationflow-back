import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    create(createCompanyDto: CreateCompanyDto, req: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        customFields: import("@prisma/client/runtime/library").JsonValue | null;
        color: string | null;
        userId: string;
    }>;
    findAll(req: any): Promise<{
        myRole: import(".prisma/client").$Enums.MemberRole;
        user: {
            email: string;
            name: string;
            id: string;
        };
        projects: {
            name: string;
            id: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
        }[];
        _count: {
            projects: number;
            members: number;
        };
        members: ({
            user: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            role: import(".prisma/client").$Enums.MemberRole;
            companyId: string;
        })[];
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        customFields: import("@prisma/client/runtime/library").JsonValue | null;
        color: string | null;
        userId: string;
    }[]>;
    findOne(id: string, req: any): Promise<{
        projects: ({
            _count: {
                tasks: number;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            customFields: import("@prisma/client/runtime/library").JsonValue | null;
            color: string | null;
            userId: string;
            companyId: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            client: string | null;
            responsible: string | null;
            startDate: Date | null;
            endDate: Date | null;
            budget: number | null;
        })[];
        members: ({
            user: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            role: import(".prisma/client").$Enums.MemberRole;
            companyId: string;
        })[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        customFields: import("@prisma/client/runtime/library").JsonValue | null;
        color: string | null;
        userId: string;
    }>;
    update(id: string, updateCompanyDto: UpdateCompanyDto, req: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        customFields: import("@prisma/client/runtime/library").JsonValue | null;
        color: string | null;
        userId: string;
    }>;
    remove(id: string, req: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        customFields: import("@prisma/client/runtime/library").JsonValue | null;
        color: string | null;
        userId: string;
    }>;
}
