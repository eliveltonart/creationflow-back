import { PrismaService } from '../database/prisma.service';
import { EncryptionService } from './encryption.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
export declare class ResourcesService {
    private db;
    private encryption;
    constructor(db: PrismaService, encryption: EncryptionService);
    private assertMember;
    create(dto: CreateResourceDto, userId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        url: string | null;
        type: import(".prisma/client").$Enums.ResourceType;
        favicon: string | null;
        fields: string;
        notes: string | null;
        visibility: import(".prisma/client").$Enums.ResourceVisibility;
        createdById: string;
    }>;
    findAllForCompany(companyId: string, userId: string): Promise<{
        id: string;
        name: string;
        url: string;
        favicon: string;
        type: import(".prisma/client").$Enums.ResourceType;
        visibility: import(".prisma/client").$Enums.ResourceVisibility;
        createdAt: Date;
        updatedAt: Date;
        createdBy: {
            email: string;
            name: string;
            id: string;
        };
        accessList: {
            email: string;
            name: string;
            id: string;
        }[];
    }[]>;
    findOne(id: string, userId: string): Promise<{
        id: string;
        name: string;
        url: string;
        favicon: string;
        type: import(".prisma/client").$Enums.ResourceType;
        visibility: import(".prisma/client").$Enums.ResourceVisibility;
        fields: Record<string, any>;
        notes: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: {
            email: string;
            name: string;
            id: string;
        };
        accessList: {
            email: string;
            name: string;
            id: string;
        }[];
    }>;
    update(id: string, dto: UpdateResourceDto, userId: string): Promise<{
        id: string;
        name: string;
        url: string;
        favicon: string;
        type: import(".prisma/client").$Enums.ResourceType;
        visibility: import(".prisma/client").$Enums.ResourceVisibility;
        fields: Record<string, any>;
        notes: string;
        createdAt: Date;
        updatedAt: Date;
        createdBy: {
            email: string;
            name: string;
            id: string;
        };
        accessList: {
            email: string;
            name: string;
            id: string;
        }[];
    }>;
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
    getCompanyUsers(companyId: string, userId: string): Promise<{
        email: string;
        name: string;
        id: string;
    }[]>;
}
