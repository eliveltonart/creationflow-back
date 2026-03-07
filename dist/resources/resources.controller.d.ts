import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
export declare class ResourcesController {
    private readonly service;
    constructor(service: ResourcesService);
    create(dto: CreateResourceDto, req: any): Promise<{
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
    findAll(companyId: string, req: any): Promise<{
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
    getCompanyUsers(companyId: string, req: any): Promise<{
        email: string;
        name: string;
        id: string;
    }[]>;
    findOne(id: string, req: any): Promise<{
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
    update(id: string, dto: UpdateResourceDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
}
