import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: CreateProjectDto, req: any): Promise<{
        company: {
            name: string;
            id: string;
            color: string;
        };
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
    }>;
    findAllGrouped(req: any): Promise<({
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
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        customFields: import("@prisma/client/runtime/library").JsonValue | null;
        color: string | null;
        userId: string;
    })[]>;
    findAll(req: any, companyId?: string): Promise<({
        company: {
            name: string;
            id: string;
            color: string;
        };
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
    })[]>;
    findOne(id: string, req: any): Promise<{
        company: {
            name: string;
            id: string;
            color: string;
        };
        tasks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            customFields: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            priority: import(".prisma/client").$Enums.Priority;
            title: string;
            type: import(".prisma/client").$Enums.TaskType;
            storyPoints: number | null;
            estimatedHours: number | null;
            actualHours: number | null;
            dueDate: Date | null;
            assignees: import("@prisma/client/runtime/library").JsonValue | null;
            prValidators: import("@prisma/client/runtime/library").JsonValue | null;
            testers: import("@prisma/client/runtime/library").JsonValue | null;
            dod: import("@prisma/client/runtime/library").JsonValue | null;
            isRecurring: boolean;
            recurringPattern: string | null;
            projectId: string;
            sprintId: string | null;
        }[];
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
    }>;
    update(id: string, updateProjectDto: UpdateProjectDto, req: any): Promise<{
        company: {
            name: string;
            id: string;
            color: string;
        };
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
        companyId: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        client: string | null;
        responsible: string | null;
        startDate: Date | null;
        endDate: Date | null;
        budget: number | null;
    }>;
}
