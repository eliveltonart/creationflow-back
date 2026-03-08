import { PrismaService } from '../database/prisma.service';
import { CreateRetroDto, UpdateRetroDto, CreateCardDto, UpdateCardDto, VoteCardDto, CreateActionDto, JoinRetroDto } from './dto/retro.dto';
export declare class RetroService {
    private prisma;
    constructor(prisma: PrismaService);
    private assertFacilitator;
    private assertAccess;
    create(dto: CreateRetroDto, userId: string): Promise<{
        project: {
            name: string;
            id: string;
            companyId: string;
        };
        sprint: {
            name: string;
            id: string;
        };
        task: {
            id: string;
            title: string;
        };
        _count: {
            cards: number;
            actions: number;
            participants: number;
        };
        facilitator: {
            email: string;
            name: string;
            id: string;
        };
        cards: ({
            author: {
                email: string;
                name: string;
                id: string;
            };
            actions: {
                id: string;
                title: string;
            }[];
            votes: {
                id: string;
                createdAt: Date;
                guestId: string | null;
                points: number;
                cardId: string;
                voterId: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string | null;
            content: string;
            category: import(".prisma/client").$Enums.RetroCardCategory;
            authorName: string | null;
            retroId: string;
        })[];
        actions: ({
            task: {
                id: string;
                status: import(".prisma/client").$Enums.TaskStatus;
                title: string;
            };
            card: {
                id: string;
                content: string;
                category: import(".prisma/client").$Enums.RetroCardCategory;
            };
            assignee: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            priority: import(".prisma/client").$Enums.Priority;
            title: string;
            dueDate: Date | null;
            taskId: string | null;
            assigneeId: string | null;
            cardId: string;
            retroId: string;
        })[];
        participants: ({
            user: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            name: string;
            id: string;
            userId: string | null;
            guestId: string | null;
            retroId: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.RetroStatus;
        title: string;
        projectId: string;
        sprintId: string | null;
        taskId: string | null;
        closedAt: Date | null;
        isAnonymous: boolean;
        voteLimit: number;
        col1Name: string;
        col1Color: string;
        col2Name: string;
        col2Color: string;
        col3Name: string;
        col3Color: string;
        shareToken: string;
        isLocked: boolean;
        facilitatorId: string;
    }>;
    findAll(userId: string, projectId?: string, status?: string): Promise<({
        project: {
            name: string;
            id: string;
            companyId: string;
        };
        sprint: {
            name: string;
            id: string;
        };
        task: {
            id: string;
            title: string;
        };
        _count: {
            cards: number;
            actions: number;
            participants: number;
        };
        facilitator: {
            email: string;
            name: string;
            id: string;
        };
        cards: ({
            author: {
                email: string;
                name: string;
                id: string;
            };
            actions: {
                id: string;
                title: string;
            }[];
            votes: {
                id: string;
                createdAt: Date;
                guestId: string | null;
                points: number;
                cardId: string;
                voterId: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string | null;
            content: string;
            category: import(".prisma/client").$Enums.RetroCardCategory;
            authorName: string | null;
            retroId: string;
        })[];
        actions: ({
            task: {
                id: string;
                status: import(".prisma/client").$Enums.TaskStatus;
                title: string;
            };
            card: {
                id: string;
                content: string;
                category: import(".prisma/client").$Enums.RetroCardCategory;
            };
            assignee: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            priority: import(".prisma/client").$Enums.Priority;
            title: string;
            dueDate: Date | null;
            taskId: string | null;
            assigneeId: string | null;
            cardId: string;
            retroId: string;
        })[];
        participants: ({
            user: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            name: string;
            id: string;
            userId: string | null;
            guestId: string | null;
            retroId: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.RetroStatus;
        title: string;
        projectId: string;
        sprintId: string | null;
        taskId: string | null;
        closedAt: Date | null;
        isAnonymous: boolean;
        voteLimit: number;
        col1Name: string;
        col1Color: string;
        col2Name: string;
        col2Color: string;
        col3Name: string;
        col3Color: string;
        shareToken: string;
        isLocked: boolean;
        facilitatorId: string;
    })[]>;
    findByShareToken(token: string): Promise<{
        project: {
            name: string;
            id: string;
            companyId: string;
        };
        sprint: {
            name: string;
            id: string;
        };
        task: {
            id: string;
            title: string;
        };
        _count: {
            cards: number;
            actions: number;
            participants: number;
        };
        facilitator: {
            email: string;
            name: string;
            id: string;
        };
        cards: ({
            author: {
                email: string;
                name: string;
                id: string;
            };
            actions: {
                id: string;
                title: string;
            }[];
            votes: {
                id: string;
                createdAt: Date;
                guestId: string | null;
                points: number;
                cardId: string;
                voterId: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string | null;
            content: string;
            category: import(".prisma/client").$Enums.RetroCardCategory;
            authorName: string | null;
            retroId: string;
        })[];
        actions: ({
            task: {
                id: string;
                status: import(".prisma/client").$Enums.TaskStatus;
                title: string;
            };
            card: {
                id: string;
                content: string;
                category: import(".prisma/client").$Enums.RetroCardCategory;
            };
            assignee: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            priority: import(".prisma/client").$Enums.Priority;
            title: string;
            dueDate: Date | null;
            taskId: string | null;
            assigneeId: string | null;
            cardId: string;
            retroId: string;
        })[];
        participants: ({
            user: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            name: string;
            id: string;
            userId: string | null;
            guestId: string | null;
            retroId: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.RetroStatus;
        title: string;
        projectId: string;
        sprintId: string | null;
        taskId: string | null;
        closedAt: Date | null;
        isAnonymous: boolean;
        voteLimit: number;
        col1Name: string;
        col1Color: string;
        col2Name: string;
        col2Color: string;
        col3Name: string;
        col3Color: string;
        shareToken: string;
        isLocked: boolean;
        facilitatorId: string;
    }>;
    findOne(id: string, userId: string): Promise<{
        project: {
            name: string;
            id: string;
            companyId: string;
        };
        sprint: {
            name: string;
            id: string;
        };
        task: {
            id: string;
            title: string;
        };
        _count: {
            cards: number;
            actions: number;
            participants: number;
        };
        facilitator: {
            email: string;
            name: string;
            id: string;
        };
        cards: ({
            author: {
                email: string;
                name: string;
                id: string;
            };
            actions: {
                id: string;
                title: string;
            }[];
            votes: {
                id: string;
                createdAt: Date;
                guestId: string | null;
                points: number;
                cardId: string;
                voterId: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string | null;
            content: string;
            category: import(".prisma/client").$Enums.RetroCardCategory;
            authorName: string | null;
            retroId: string;
        })[];
        actions: ({
            task: {
                id: string;
                status: import(".prisma/client").$Enums.TaskStatus;
                title: string;
            };
            card: {
                id: string;
                content: string;
                category: import(".prisma/client").$Enums.RetroCardCategory;
            };
            assignee: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            priority: import(".prisma/client").$Enums.Priority;
            title: string;
            dueDate: Date | null;
            taskId: string | null;
            assigneeId: string | null;
            cardId: string;
            retroId: string;
        })[];
        participants: ({
            user: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            name: string;
            id: string;
            userId: string | null;
            guestId: string | null;
            retroId: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.RetroStatus;
        title: string;
        projectId: string;
        sprintId: string | null;
        taskId: string | null;
        closedAt: Date | null;
        isAnonymous: boolean;
        voteLimit: number;
        col1Name: string;
        col1Color: string;
        col2Name: string;
        col2Color: string;
        col3Name: string;
        col3Color: string;
        shareToken: string;
        isLocked: boolean;
        facilitatorId: string;
    }>;
    update(id: string, dto: UpdateRetroDto, userId: string): Promise<{
        project: {
            name: string;
            id: string;
            companyId: string;
        };
        sprint: {
            name: string;
            id: string;
        };
        task: {
            id: string;
            title: string;
        };
        _count: {
            cards: number;
            actions: number;
            participants: number;
        };
        facilitator: {
            email: string;
            name: string;
            id: string;
        };
        cards: ({
            author: {
                email: string;
                name: string;
                id: string;
            };
            actions: {
                id: string;
                title: string;
            }[];
            votes: {
                id: string;
                createdAt: Date;
                guestId: string | null;
                points: number;
                cardId: string;
                voterId: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string | null;
            content: string;
            category: import(".prisma/client").$Enums.RetroCardCategory;
            authorName: string | null;
            retroId: string;
        })[];
        actions: ({
            task: {
                id: string;
                status: import(".prisma/client").$Enums.TaskStatus;
                title: string;
            };
            card: {
                id: string;
                content: string;
                category: import(".prisma/client").$Enums.RetroCardCategory;
            };
            assignee: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            priority: import(".prisma/client").$Enums.Priority;
            title: string;
            dueDate: Date | null;
            taskId: string | null;
            assigneeId: string | null;
            cardId: string;
            retroId: string;
        })[];
        participants: ({
            user: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            name: string;
            id: string;
            userId: string | null;
            guestId: string | null;
            retroId: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.RetroStatus;
        title: string;
        projectId: string;
        sprintId: string | null;
        taskId: string | null;
        closedAt: Date | null;
        isAnonymous: boolean;
        voteLimit: number;
        col1Name: string;
        col1Color: string;
        col2Name: string;
        col2Color: string;
        col3Name: string;
        col3Color: string;
        shareToken: string;
        isLocked: boolean;
        facilitatorId: string;
    }>;
    delete(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.RetroStatus;
        title: string;
        projectId: string;
        sprintId: string | null;
        taskId: string | null;
        closedAt: Date | null;
        isAnonymous: boolean;
        voteLimit: number;
        col1Name: string;
        col1Color: string;
        col2Name: string;
        col2Color: string;
        col3Name: string;
        col3Color: string;
        shareToken: string;
        isLocked: boolean;
        facilitatorId: string;
    }>;
    revokeShareToken(id: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.RetroStatus;
        title: string;
        projectId: string;
        sprintId: string | null;
        taskId: string | null;
        closedAt: Date | null;
        isAnonymous: boolean;
        voteLimit: number;
        col1Name: string;
        col1Color: string;
        col2Name: string;
        col2Color: string;
        col3Name: string;
        col3Color: string;
        shareToken: string;
        isLocked: boolean;
        facilitatorId: string;
    }>;
    advancePhase(id: string, userId: string): Promise<{
        project: {
            name: string;
            id: string;
            companyId: string;
        };
        sprint: {
            name: string;
            id: string;
        };
        task: {
            id: string;
            title: string;
        };
        _count: {
            cards: number;
            actions: number;
            participants: number;
        };
        facilitator: {
            email: string;
            name: string;
            id: string;
        };
        cards: ({
            author: {
                email: string;
                name: string;
                id: string;
            };
            actions: {
                id: string;
                title: string;
            }[];
            votes: {
                id: string;
                createdAt: Date;
                guestId: string | null;
                points: number;
                cardId: string;
                voterId: string | null;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            authorId: string | null;
            content: string;
            category: import(".prisma/client").$Enums.RetroCardCategory;
            authorName: string | null;
            retroId: string;
        })[];
        actions: ({
            task: {
                id: string;
                status: import(".prisma/client").$Enums.TaskStatus;
                title: string;
            };
            card: {
                id: string;
                content: string;
                category: import(".prisma/client").$Enums.RetroCardCategory;
            };
            assignee: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            priority: import(".prisma/client").$Enums.Priority;
            title: string;
            dueDate: Date | null;
            taskId: string | null;
            assigneeId: string | null;
            cardId: string;
            retroId: string;
        })[];
        participants: ({
            user: {
                email: string;
                name: string;
                id: string;
            };
        } & {
            name: string;
            id: string;
            userId: string | null;
            guestId: string | null;
            retroId: string;
            joinedAt: Date;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        status: import(".prisma/client").$Enums.RetroStatus;
        title: string;
        projectId: string;
        sprintId: string | null;
        taskId: string | null;
        closedAt: Date | null;
        isAnonymous: boolean;
        voteLimit: number;
        col1Name: string;
        col1Color: string;
        col2Name: string;
        col2Color: string;
        col3Name: string;
        col3Color: string;
        shareToken: string;
        isLocked: boolean;
        facilitatorId: string;
    }>;
    createCard(retroId: string, dto: CreateCardDto, userId?: string): Promise<{
        author: {
            email: string;
            name: string;
            id: string;
        };
        actions: {
            id: string;
            title: string;
        }[];
        votes: {
            id: string;
            createdAt: Date;
            guestId: string | null;
            points: number;
            cardId: string;
            voterId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string | null;
        content: string;
        category: import(".prisma/client").$Enums.RetroCardCategory;
        authorName: string | null;
        retroId: string;
    }>;
    updateCard(retroId: string, cardId: string, dto: UpdateCardDto, userId?: string): Promise<{
        author: {
            email: string;
            name: string;
            id: string;
        };
        actions: {
            id: string;
            title: string;
        }[];
        votes: {
            id: string;
            createdAt: Date;
            guestId: string | null;
            points: number;
            cardId: string;
            voterId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string | null;
        content: string;
        category: import(".prisma/client").$Enums.RetroCardCategory;
        authorName: string | null;
        retroId: string;
    }>;
    deleteCard(retroId: string, cardId: string, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string | null;
        content: string;
        category: import(".prisma/client").$Enums.RetroCardCategory;
        authorName: string | null;
        retroId: string;
    }>;
    voteCard(retroId: string, cardId: string, dto: VoteCardDto, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        guestId: string | null;
        points: number;
        cardId: string;
        voterId: string | null;
    }>;
    removeVote(retroId: string, cardId: string, userId?: string, guestId?: string): Promise<{
        id: string;
        createdAt: Date;
        guestId: string | null;
        points: number;
        cardId: string;
        voterId: string | null;
    }>;
    createAction(retroId: string, dto: CreateActionDto, userId: string): Promise<{
        task: {
            id: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            title: string;
        };
        card: {
            id: string;
            content: string;
            category: import(".prisma/client").$Enums.RetroCardCategory;
        };
        assignee: {
            email: string;
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        priority: import(".prisma/client").$Enums.Priority;
        title: string;
        dueDate: Date | null;
        taskId: string | null;
        assigneeId: string | null;
        cardId: string;
        retroId: string;
    }>;
    getProjects(userId: string): Promise<{
        name: string;
        id: string;
        companyId: string;
    }[]>;
    getProjectSprints(projectId: string, userId: string): Promise<{
        name: string;
        id: string;
    }[]>;
    joinRetro(retroId: string, dto: JoinRetroDto, userId?: string): Promise<{
        name: string;
        id: string;
        userId: string | null;
        guestId: string | null;
        retroId: string;
        joinedAt: Date;
    }>;
    joinRetroByToken(token: string, dto: JoinRetroDto): Promise<{
        retroId: string;
        retroStatus: "DRAFT" | "COLECT" | "VOTE" | "ACT";
        name: string;
        id: string;
        userId: string | null;
        guestId: string | null;
        joinedAt: Date;
    }>;
    createCardByToken(token: string, dto: CreateCardDto): Promise<{
        author: {
            email: string;
            name: string;
            id: string;
        };
        actions: {
            id: string;
            title: string;
        }[];
        votes: {
            id: string;
            createdAt: Date;
            guestId: string | null;
            points: number;
            cardId: string;
            voterId: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string | null;
        content: string;
        category: import(".prisma/client").$Enums.RetroCardCategory;
        authorName: string | null;
        retroId: string;
    }>;
    voteCardByToken(token: string, cardId: string, dto: VoteCardDto): Promise<{
        id: string;
        createdAt: Date;
        guestId: string | null;
        points: number;
        cardId: string;
        voterId: string | null;
    }>;
}
