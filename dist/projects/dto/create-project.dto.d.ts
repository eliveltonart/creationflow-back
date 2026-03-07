import { ProjectStatus } from '@prisma/client';
export declare class CreateProjectDto {
    name: string;
    companyId: string;
    description?: string;
    status?: ProjectStatus;
    color?: string;
    client?: string;
    responsible?: string;
    startDate?: string;
    endDate?: string;
    budget?: number;
}
