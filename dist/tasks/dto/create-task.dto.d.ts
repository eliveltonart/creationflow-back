import { TaskType, TaskStatus, Priority } from '@prisma/client';
export declare class CreateTaskDto {
    title: string;
    projectId: string;
    type?: TaskType;
    status?: TaskStatus;
    priority?: Priority;
    storyPoints?: number;
    estimatedHours?: number;
    dueDate?: string;
    sprintId?: string;
    description?: string;
    assignees?: {
        name: string;
        userId?: string;
    }[];
    prValidators?: {
        name: string;
        userId?: string;
    }[];
    testers?: {
        name: string;
        userId?: string;
    }[];
    dod?: {
        text: string;
        completed: boolean;
    }[];
}
