import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getData(req: any): Promise<{
        role: string;
        summary: {
            companies: number;
            teamMembers: number;
            projects: {
                total: number;
                planning: number;
                active: number;
                completed: number;
                onHold: number;
            };
            tasks: {
                total: number;
                todo: number;
                inProgress: number;
                inReview: number;
                done: number;
                blocked: number;
                overdue: number;
            };
            activeSprints: number;
        };
        companyBreakdown: {
            id: string;
            name: string;
            color: string;
            memberCount: number;
            projectCount: number;
            members: {
                id: string;
                name: string;
                email: string;
                role: import(".prisma/client").$Enums.MemberRole;
            }[];
            projects: {
                id: string;
                name: string;
                status: import(".prisma/client").$Enums.ProjectStatus;
                color: string;
                activeSprint: {
                    name: string;
                    id: string;
                    startDate: Date;
                    endDate: Date;
                    isActive: boolean;
                };
                taskCounts: {
                    total: number;
                    todo: number;
                    inProgress: number;
                    done: number;
                    blocked: number;
                };
            }[];
            taskCounts: {
                total: number;
                todo: number;
                inProgress: number;
                done: number;
                blocked: number;
                overdue: number;
            };
        }[];
        activeSprints: {
            projectName: string;
            companyName: string;
            name: string;
            id: string;
            startDate: Date;
            endDate: Date;
            isActive: boolean;
        }[];
        overdueTasks: {
            projectName: string;
            companyName: string;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.TaskStatus;
            priority: import(".prisma/client").$Enums.Priority;
            title: string;
            type: import(".prisma/client").$Enums.TaskType;
            storyPoints: number;
            dueDate: Date;
            assignees: import("@prisma/client/runtime/library").JsonValue;
            sprintId: string;
        }[];
        upcomingDeadlines: {
            projectName: string;
            companyName: string;
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.TaskStatus;
            priority: import(".prisma/client").$Enums.Priority;
            title: string;
            type: import(".prisma/client").$Enums.TaskType;
            storyPoints: number;
            dueDate: Date;
            assignees: import("@prisma/client/runtime/library").JsonValue;
            sprintId: string;
        }[];
    } | {
        role: string;
        summary: {
            projects: number;
            companies: number;
            tasks: {
                total: number;
                todo: number;
                inProgress: number;
                inReview: number;
                done: number;
                blocked: number;
            };
            storyPoints: {
                done: number;
                total: number;
            };
            activeSprints: number;
        };
        projectBreakdown: {
            id: string;
            name: string;
            status: import(".prisma/client").$Enums.ProjectStatus;
            color: string;
            companyName: string;
            activeSprint: {
                name: string;
                id: string;
                startDate: Date;
                endDate: Date;
            };
            myTaskCounts: {
                total: number;
                todo: number;
                inProgress: number;
                done: number;
            };
        }[];
        activeSprints: {
            projectName: string;
            name: string;
            id: string;
            startDate: Date;
            endDate: Date;
        }[];
        recentWork: {
            projectName: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.TaskStatus;
            priority: import(".prisma/client").$Enums.Priority;
            title: string;
            type: import(".prisma/client").$Enums.TaskType;
            storyPoints: number;
            dueDate: Date;
            assignees: import("@prisma/client/runtime/library").JsonValue;
            sprintId: string;
        }[];
        upcomingDeadlines: {
            projectName: string;
            companyName: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.TaskStatus;
            priority: import(".prisma/client").$Enums.Priority;
            title: string;
            type: import(".prisma/client").$Enums.TaskType;
            storyPoints: number;
            dueDate: Date;
            assignees: import("@prisma/client/runtime/library").JsonValue;
            sprintId: string;
        }[];
        overdueTasks: {
            projectName: string;
            companyName: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.TaskStatus;
            priority: import(".prisma/client").$Enums.Priority;
            title: string;
            type: import(".prisma/client").$Enums.TaskType;
            storyPoints: number;
            dueDate: Date;
            assignees: import("@prisma/client/runtime/library").JsonValue;
            sprintId: string;
        }[];
    }>;
}
