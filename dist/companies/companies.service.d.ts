import { PrismaService } from '../database/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
export declare class CompaniesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCompanyDto: CreateCompanyDto, userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        customFields: import("@prisma/client/runtime/library").JsonValue | null;
        color: string | null;
        userId: string;
    }>;
    findAll(userId: string): Promise<{
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
    findOne(id: string, userId: string): Promise<{
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
    update(id: string, updateCompanyDto: UpdateCompanyDto, userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        customFields: import("@prisma/client/runtime/library").JsonValue | null;
        color: string | null;
        userId: string;
    }>;
    remove(id: string, userId: string): Promise<{
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
