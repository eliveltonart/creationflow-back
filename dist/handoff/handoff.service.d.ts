import { PrismaService } from '../database/prisma.service';
import { CreateHandoffDto, UpdateHandoffDto, UpdateHandoffStatusDto, CreateComponentDto, UpdateComponentDto, CreateCommentDto, LinkTaskDto } from './dto/create-handoff.dto';
export declare class HandoffService {
    private prisma;
    constructor(prisma: PrismaService);
    private assertAccess;
    create(dto: CreateHandoffDto, userId: string): Promise<{
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
    findAll(userId: string, projectId?: string, status?: string): Promise<({
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
    findOne(id: string, userId: string): Promise<{
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
    update(id: string, dto: UpdateHandoffDto, userId: string): Promise<{
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
    updateStatus(id: string, dto: UpdateHandoffStatusDto, userId: string): Promise<{
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
    remove(id: string, userId: string): Promise<{
        deleted: boolean;
    }>;
    createComponent(handoffId: string, dto: CreateComponentDto, userId: string): Promise<{
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
    updateComponent(handoffId: string, componentId: string, dto: UpdateComponentDto, userId: string): Promise<{
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
    removeComponent(handoffId: string, componentId: string, userId: string): Promise<{
        deleted: boolean;
    }>;
    createComment(handoffId: string, dto: CreateCommentDto, userId: string): Promise<{
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
    resolveComment(handoffId: string, commentId: string, userId: string): Promise<{
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
    linkTasks(handoffId: string, dto: LinkTaskDto, userId: string): Promise<{
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
    unlinkTask(handoffId: string, taskId: string, userId: string): Promise<{
        deleted: boolean;
    }>;
    getAccessibleProjects(userId: string): Promise<{
        company: {
            name: string;
        };
        name: string;
        id: string;
        companyId: string;
    }[]>;
}
