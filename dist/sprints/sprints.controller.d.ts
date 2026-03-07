import { SprintsService } from './sprints.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
export declare class SprintsController {
    private readonly sprintsService;
    constructor(sprintsService: SprintsService);
    create(dto: CreateSprintDto, req: any): Promise<{
        _count: {
            tasks: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date | null;
        endDate: Date | null;
        projectId: string;
        goal: string | null;
        isActive: boolean;
    }>;
    findByProject(projectId: string, req: any): Promise<({
        _count: {
            tasks: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date | null;
        endDate: Date | null;
        projectId: string;
        goal: string | null;
        isActive: boolean;
    })[]>;
    update(id: string, dto: UpdateSprintDto, req: any): Promise<{
        _count: {
            tasks: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date | null;
        endDate: Date | null;
        projectId: string;
        goal: string | null;
        isActive: boolean;
    }>;
    remove(id: string, req: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startDate: Date | null;
        endDate: Date | null;
        projectId: string;
        goal: string | null;
        isActive: boolean;
    }>;
}
