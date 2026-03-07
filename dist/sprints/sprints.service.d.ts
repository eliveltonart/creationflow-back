import { PrismaService } from '../database/prisma.service';
import { CreateSprintDto } from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
export declare class SprintsService {
    private prisma;
    constructor(prisma: PrismaService);
    private verifyProjectAccess;
    create(dto: CreateSprintDto, userId: string): Promise<{
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
    findByProject(projectId: string, userId: string): Promise<({
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
    update(id: string, dto: UpdateSprintDto, userId: string): Promise<{
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
    remove(id: string, userId: string): Promise<{
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
