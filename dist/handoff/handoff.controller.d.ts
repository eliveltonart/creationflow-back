import { HandoffService } from './handoff.service';
import { CreateHandoffDto, UpdateHandoffDto, UpdateHandoffStatusDto, CreateComponentDto, UpdateComponentDto, CreateCommentDto, LinkTaskDto } from './dto/create-handoff.dto';
export declare class HandoffController {
    private readonly service;
    constructor(service: HandoffService);
    create(dto: CreateHandoffDto, req: any): Promise<{
        project: {
            name: string;
            id: string;
            companyId: string;
        };
        _count: {
            components: number;
            comments: number;
        };
        designer: {
            email: string;
            name: string;
            id: string;
        };
        developer: {
            email: string;
            name: string;
            id: string;
        };
        components: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            notes: string | null;
            usage: string | null;
            figmaLink: string | null;
            variants: import("@prisma/client/runtime/library").JsonValue | null;
            states: import("@prisma/client/runtime/library").JsonValue | null;
            styles: import("@prisma/client/runtime/library").JsonValue | null;
            responsiveSpecs: import("@prisma/client/runtime/library").JsonValue | null;
            accessibilityNotes: string | null;
            wcagLevel: string | null;
            codeSnippets: import("@prisma/client/runtime/library").JsonValue | null;
            order: number;
            handoffId: string;
        }[];
        comments: ({
            author: {
                email: string;
                name: string;
                id: string;
            };
            replies: ({
                author: {
                    email: string;
                    name: string;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                componentId: string | null;
                parentId: string | null;
                handoffId: string;
                resolved: boolean;
                authorId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            componentId: string | null;
            parentId: string | null;
            handoffId: string;
            resolved: boolean;
            authorId: string;
        })[];
        linkedTasks: ({
            task: {
                id: string;
                status: import(".prisma/client").$Enums.TaskStatus;
                title: string;
                type: import(".prisma/client").$Enums.TaskType;
            };
        } & {
            id: string;
            createdAt: Date;
            taskId: string;
            handoffId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.HandoffStatus;
        version: number;
        title: string;
        projectId: string;
        developerId: string | null;
        rationale: string | null;
        userJourneyContext: string | null;
        gapValidationErrors: boolean;
        gapValidationErrorsNA: boolean;
        gapErrorPages: boolean;
        gapErrorPagesNA: boolean;
        gapAlerts: boolean;
        gapAlertsNA: boolean;
        gapLoadingStates: boolean;
        gapLoadingStatesNA: boolean;
        gapEmptyStates: boolean;
        gapEmptyStatesNA: boolean;
        gapComponentStates: boolean;
        gapComponentStatesNA: boolean;
        gapPasswordReset: boolean;
        gapPasswordResetNA: boolean;
        gapResponsive: boolean;
        gapResponsiveNA: boolean;
        iterationCount: number;
        submittedAt: Date | null;
        completedAt: Date | null;
        designerId: string;
    }>;
    findAll(projectId: string, status: string, req: any): Promise<({
        project: {
            name: string;
            id: string;
            companyId: string;
        };
        _count: {
            components: number;
            comments: number;
        };
        designer: {
            email: string;
            name: string;
            id: string;
        };
        developer: {
            email: string;
            name: string;
            id: string;
        };
        components: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            notes: string | null;
            usage: string | null;
            figmaLink: string | null;
            variants: import("@prisma/client/runtime/library").JsonValue | null;
            states: import("@prisma/client/runtime/library").JsonValue | null;
            styles: import("@prisma/client/runtime/library").JsonValue | null;
            responsiveSpecs: import("@prisma/client/runtime/library").JsonValue | null;
            accessibilityNotes: string | null;
            wcagLevel: string | null;
            codeSnippets: import("@prisma/client/runtime/library").JsonValue | null;
            order: number;
            handoffId: string;
        }[];
        comments: ({
            author: {
                email: string;
                name: string;
                id: string;
            };
            replies: ({
                author: {
                    email: string;
                    name: string;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                componentId: string | null;
                parentId: string | null;
                handoffId: string;
                resolved: boolean;
                authorId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            componentId: string | null;
            parentId: string | null;
            handoffId: string;
            resolved: boolean;
            authorId: string;
        })[];
        linkedTasks: ({
            task: {
                id: string;
                status: import(".prisma/client").$Enums.TaskStatus;
                title: string;
                type: import(".prisma/client").$Enums.TaskType;
            };
        } & {
            id: string;
            createdAt: Date;
            taskId: string;
            handoffId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.HandoffStatus;
        version: number;
        title: string;
        projectId: string;
        developerId: string | null;
        rationale: string | null;
        userJourneyContext: string | null;
        gapValidationErrors: boolean;
        gapValidationErrorsNA: boolean;
        gapErrorPages: boolean;
        gapErrorPagesNA: boolean;
        gapAlerts: boolean;
        gapAlertsNA: boolean;
        gapLoadingStates: boolean;
        gapLoadingStatesNA: boolean;
        gapEmptyStates: boolean;
        gapEmptyStatesNA: boolean;
        gapComponentStates: boolean;
        gapComponentStatesNA: boolean;
        gapPasswordReset: boolean;
        gapPasswordResetNA: boolean;
        gapResponsive: boolean;
        gapResponsiveNA: boolean;
        iterationCount: number;
        submittedAt: Date | null;
        completedAt: Date | null;
        designerId: string;
    })[]>;
    getProjects(req: any): Promise<{
        company: {
            name: string;
        };
        name: string;
        id: string;
        companyId: string;
    }[]>;
    findOne(id: string, req: any): Promise<{
        project: {
            name: string;
            id: string;
            companyId: string;
        };
        _count: {
            components: number;
            comments: number;
        };
        designer: {
            email: string;
            name: string;
            id: string;
        };
        developer: {
            email: string;
            name: string;
            id: string;
        };
        components: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            notes: string | null;
            usage: string | null;
            figmaLink: string | null;
            variants: import("@prisma/client/runtime/library").JsonValue | null;
            states: import("@prisma/client/runtime/library").JsonValue | null;
            styles: import("@prisma/client/runtime/library").JsonValue | null;
            responsiveSpecs: import("@prisma/client/runtime/library").JsonValue | null;
            accessibilityNotes: string | null;
            wcagLevel: string | null;
            codeSnippets: import("@prisma/client/runtime/library").JsonValue | null;
            order: number;
            handoffId: string;
        }[];
        comments: ({
            author: {
                email: string;
                name: string;
                id: string;
            };
            replies: ({
                author: {
                    email: string;
                    name: string;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                componentId: string | null;
                parentId: string | null;
                handoffId: string;
                resolved: boolean;
                authorId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            componentId: string | null;
            parentId: string | null;
            handoffId: string;
            resolved: boolean;
            authorId: string;
        })[];
        linkedTasks: ({
            task: {
                id: string;
                status: import(".prisma/client").$Enums.TaskStatus;
                title: string;
                type: import(".prisma/client").$Enums.TaskType;
            };
        } & {
            id: string;
            createdAt: Date;
            taskId: string;
            handoffId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.HandoffStatus;
        version: number;
        title: string;
        projectId: string;
        developerId: string | null;
        rationale: string | null;
        userJourneyContext: string | null;
        gapValidationErrors: boolean;
        gapValidationErrorsNA: boolean;
        gapErrorPages: boolean;
        gapErrorPagesNA: boolean;
        gapAlerts: boolean;
        gapAlertsNA: boolean;
        gapLoadingStates: boolean;
        gapLoadingStatesNA: boolean;
        gapEmptyStates: boolean;
        gapEmptyStatesNA: boolean;
        gapComponentStates: boolean;
        gapComponentStatesNA: boolean;
        gapPasswordReset: boolean;
        gapPasswordResetNA: boolean;
        gapResponsive: boolean;
        gapResponsiveNA: boolean;
        iterationCount: number;
        submittedAt: Date | null;
        completedAt: Date | null;
        designerId: string;
    }>;
    update(id: string, dto: UpdateHandoffDto, req: any): Promise<{
        project: {
            name: string;
            id: string;
            companyId: string;
        };
        _count: {
            components: number;
            comments: number;
        };
        designer: {
            email: string;
            name: string;
            id: string;
        };
        developer: {
            email: string;
            name: string;
            id: string;
        };
        components: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            notes: string | null;
            usage: string | null;
            figmaLink: string | null;
            variants: import("@prisma/client/runtime/library").JsonValue | null;
            states: import("@prisma/client/runtime/library").JsonValue | null;
            styles: import("@prisma/client/runtime/library").JsonValue | null;
            responsiveSpecs: import("@prisma/client/runtime/library").JsonValue | null;
            accessibilityNotes: string | null;
            wcagLevel: string | null;
            codeSnippets: import("@prisma/client/runtime/library").JsonValue | null;
            order: number;
            handoffId: string;
        }[];
        comments: ({
            author: {
                email: string;
                name: string;
                id: string;
            };
            replies: ({
                author: {
                    email: string;
                    name: string;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                componentId: string | null;
                parentId: string | null;
                handoffId: string;
                resolved: boolean;
                authorId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            componentId: string | null;
            parentId: string | null;
            handoffId: string;
            resolved: boolean;
            authorId: string;
        })[];
        linkedTasks: ({
            task: {
                id: string;
                status: import(".prisma/client").$Enums.TaskStatus;
                title: string;
                type: import(".prisma/client").$Enums.TaskType;
            };
        } & {
            id: string;
            createdAt: Date;
            taskId: string;
            handoffId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.HandoffStatus;
        version: number;
        title: string;
        projectId: string;
        developerId: string | null;
        rationale: string | null;
        userJourneyContext: string | null;
        gapValidationErrors: boolean;
        gapValidationErrorsNA: boolean;
        gapErrorPages: boolean;
        gapErrorPagesNA: boolean;
        gapAlerts: boolean;
        gapAlertsNA: boolean;
        gapLoadingStates: boolean;
        gapLoadingStatesNA: boolean;
        gapEmptyStates: boolean;
        gapEmptyStatesNA: boolean;
        gapComponentStates: boolean;
        gapComponentStatesNA: boolean;
        gapPasswordReset: boolean;
        gapPasswordResetNA: boolean;
        gapResponsive: boolean;
        gapResponsiveNA: boolean;
        iterationCount: number;
        submittedAt: Date | null;
        completedAt: Date | null;
        designerId: string;
    }>;
    updateStatus(id: string, dto: UpdateHandoffStatusDto, req: any): Promise<{
        project: {
            name: string;
            id: string;
            companyId: string;
        };
        _count: {
            components: number;
            comments: number;
        };
        designer: {
            email: string;
            name: string;
            id: string;
        };
        developer: {
            email: string;
            name: string;
            id: string;
        };
        components: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            notes: string | null;
            usage: string | null;
            figmaLink: string | null;
            variants: import("@prisma/client/runtime/library").JsonValue | null;
            states: import("@prisma/client/runtime/library").JsonValue | null;
            styles: import("@prisma/client/runtime/library").JsonValue | null;
            responsiveSpecs: import("@prisma/client/runtime/library").JsonValue | null;
            accessibilityNotes: string | null;
            wcagLevel: string | null;
            codeSnippets: import("@prisma/client/runtime/library").JsonValue | null;
            order: number;
            handoffId: string;
        }[];
        comments: ({
            author: {
                email: string;
                name: string;
                id: string;
            };
            replies: ({
                author: {
                    email: string;
                    name: string;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                componentId: string | null;
                parentId: string | null;
                handoffId: string;
                resolved: boolean;
                authorId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            componentId: string | null;
            parentId: string | null;
            handoffId: string;
            resolved: boolean;
            authorId: string;
        })[];
        linkedTasks: ({
            task: {
                id: string;
                status: import(".prisma/client").$Enums.TaskStatus;
                title: string;
                type: import(".prisma/client").$Enums.TaskType;
            };
        } & {
            id: string;
            createdAt: Date;
            taskId: string;
            handoffId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.HandoffStatus;
        version: number;
        title: string;
        projectId: string;
        developerId: string | null;
        rationale: string | null;
        userJourneyContext: string | null;
        gapValidationErrors: boolean;
        gapValidationErrorsNA: boolean;
        gapErrorPages: boolean;
        gapErrorPagesNA: boolean;
        gapAlerts: boolean;
        gapAlertsNA: boolean;
        gapLoadingStates: boolean;
        gapLoadingStatesNA: boolean;
        gapEmptyStates: boolean;
        gapEmptyStatesNA: boolean;
        gapComponentStates: boolean;
        gapComponentStatesNA: boolean;
        gapPasswordReset: boolean;
        gapPasswordResetNA: boolean;
        gapResponsive: boolean;
        gapResponsiveNA: boolean;
        iterationCount: number;
        submittedAt: Date | null;
        completedAt: Date | null;
        designerId: string;
    }>;
    remove(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
    createComponent(id: string, dto: CreateComponentDto, req: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        notes: string | null;
        usage: string | null;
        figmaLink: string | null;
        variants: import("@prisma/client/runtime/library").JsonValue | null;
        states: import("@prisma/client/runtime/library").JsonValue | null;
        styles: import("@prisma/client/runtime/library").JsonValue | null;
        responsiveSpecs: import("@prisma/client/runtime/library").JsonValue | null;
        accessibilityNotes: string | null;
        wcagLevel: string | null;
        codeSnippets: import("@prisma/client/runtime/library").JsonValue | null;
        order: number;
        handoffId: string;
    }>;
    updateComponent(id: string, componentId: string, dto: UpdateComponentDto, req: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        notes: string | null;
        usage: string | null;
        figmaLink: string | null;
        variants: import("@prisma/client/runtime/library").JsonValue | null;
        states: import("@prisma/client/runtime/library").JsonValue | null;
        styles: import("@prisma/client/runtime/library").JsonValue | null;
        responsiveSpecs: import("@prisma/client/runtime/library").JsonValue | null;
        accessibilityNotes: string | null;
        wcagLevel: string | null;
        codeSnippets: import("@prisma/client/runtime/library").JsonValue | null;
        order: number;
        handoffId: string;
    }>;
    removeComponent(id: string, componentId: string, req: any): Promise<{
        deleted: boolean;
    }>;
    createComment(id: string, dto: CreateCommentDto, req: any): Promise<{
        author: {
            email: string;
            name: string;
            id: string;
        };
        replies: ({
            author: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            componentId: string | null;
            parentId: string | null;
            handoffId: string;
            resolved: boolean;
            authorId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        componentId: string | null;
        parentId: string | null;
        handoffId: string;
        resolved: boolean;
        authorId: string;
    }>;
    resolveComment(id: string, commentId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        text: string;
        componentId: string | null;
        parentId: string | null;
        handoffId: string;
        resolved: boolean;
        authorId: string;
    }>;
    linkTasks(id: string, dto: LinkTaskDto, req: any): Promise<{
        project: {
            name: string;
            id: string;
            companyId: string;
        };
        _count: {
            components: number;
            comments: number;
        };
        designer: {
            email: string;
            name: string;
            id: string;
        };
        developer: {
            email: string;
            name: string;
            id: string;
        };
        components: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            notes: string | null;
            usage: string | null;
            figmaLink: string | null;
            variants: import("@prisma/client/runtime/library").JsonValue | null;
            states: import("@prisma/client/runtime/library").JsonValue | null;
            styles: import("@prisma/client/runtime/library").JsonValue | null;
            responsiveSpecs: import("@prisma/client/runtime/library").JsonValue | null;
            accessibilityNotes: string | null;
            wcagLevel: string | null;
            codeSnippets: import("@prisma/client/runtime/library").JsonValue | null;
            order: number;
            handoffId: string;
        }[];
        comments: ({
            author: {
                email: string;
                name: string;
                id: string;
            };
            replies: ({
                author: {
                    email: string;
                    name: string;
                    id: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                text: string;
                componentId: string | null;
                parentId: string | null;
                handoffId: string;
                resolved: boolean;
                authorId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            text: string;
            componentId: string | null;
            parentId: string | null;
            handoffId: string;
            resolved: boolean;
            authorId: string;
        })[];
        linkedTasks: ({
            task: {
                id: string;
                status: import(".prisma/client").$Enums.TaskStatus;
                title: string;
                type: import(".prisma/client").$Enums.TaskType;
            };
        } & {
            id: string;
            createdAt: Date;
            taskId: string;
            handoffId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.HandoffStatus;
        version: number;
        title: string;
        projectId: string;
        developerId: string | null;
        rationale: string | null;
        userJourneyContext: string | null;
        gapValidationErrors: boolean;
        gapValidationErrorsNA: boolean;
        gapErrorPages: boolean;
        gapErrorPagesNA: boolean;
        gapAlerts: boolean;
        gapAlertsNA: boolean;
        gapLoadingStates: boolean;
        gapLoadingStatesNA: boolean;
        gapEmptyStates: boolean;
        gapEmptyStatesNA: boolean;
        gapComponentStates: boolean;
        gapComponentStatesNA: boolean;
        gapPasswordReset: boolean;
        gapPasswordResetNA: boolean;
        gapResponsive: boolean;
        gapResponsiveNA: boolean;
        iterationCount: number;
        submittedAt: Date | null;
        completedAt: Date | null;
        designerId: string;
    }>;
    unlinkTask(id: string, taskId: string, req: any): Promise<{
        deleted: boolean;
    }>;
}
