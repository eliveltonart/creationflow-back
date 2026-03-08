import { RetroService } from './retro.service';
import { CreateRetroDto, UpdateRetroDto, CreateCardDto, UpdateCardDto, VoteCardDto, CreateActionDto, JoinRetroDto } from './dto/retro.dto';
export declare class RetroController {
    private readonly retroService;
    constructor(retroService: RetroService);
    getByShareToken(token: string): Promise<{
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
            retroId: string;
            authorName: string | null;
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
    joinViaShare(token: string, dto: JoinRetroDto): Promise<{
        retroId: string;
        retroStatus: "DRAFT" | "COLECT" | "VOTE" | "ACT";
        name: string;
        id: string;
        userId: string | null;
        guestId: string | null;
        joinedAt: Date;
    }>;
    addCardViaShare(token: string, dto: CreateCardDto): Promise<{
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
        retroId: string;
        authorName: string | null;
    }>;
    voteViaShare(token: string, cardId: string, dto: VoteCardDto): Promise<{
        id: string;
        createdAt: Date;
        guestId: string | null;
        points: number;
        cardId: string;
        voterId: string | null;
    }>;
    getProjects(req: any): Promise<{
        name: string;
        id: string;
        companyId: string;
    }[]>;
    getProjectSprints(projectId: string, req: any): Promise<{
        name: string;
        id: string;
    }[]>;
    findAll(req: any, projectId?: string, status?: string): Promise<({
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
            retroId: string;
            authorName: string | null;
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
    create(dto: CreateRetroDto, req: any): Promise<{
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
            retroId: string;
            authorName: string | null;
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
    findOne(id: string, req: any): Promise<{
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
            retroId: string;
            authorName: string | null;
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
    update(id: string, dto: UpdateRetroDto, req: any): Promise<{
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
            retroId: string;
            authorName: string | null;
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
    remove(id: string, req: any): Promise<{
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
    advancePhase(id: string, req: any): Promise<{
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
            retroId: string;
            authorName: string | null;
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
    revokeShareToken(id: string, req: any): Promise<{
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
    joinRetro(id: string, dto: JoinRetroDto, req: any): Promise<{
        name: string;
        id: string;
        userId: string | null;
        guestId: string | null;
        retroId: string;
        joinedAt: Date;
    }>;
    createCard(id: string, dto: CreateCardDto, req: any): Promise<{
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
        retroId: string;
        authorName: string | null;
    }>;
    updateCard(id: string, cardId: string, dto: UpdateCardDto, req: any): Promise<{
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
        retroId: string;
        authorName: string | null;
    }>;
    deleteCard(id: string, cardId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        authorId: string | null;
        content: string;
        category: import(".prisma/client").$Enums.RetroCardCategory;
        retroId: string;
        authorName: string | null;
    }>;
    voteCard(id: string, cardId: string, dto: VoteCardDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        guestId: string | null;
        points: number;
        cardId: string;
        voterId: string | null;
    }>;
    removeVote(id: string, cardId: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        guestId: string | null;
        points: number;
        cardId: string;
        voterId: string | null;
    }>;
    createAction(id: string, dto: CreateActionDto, req: any): Promise<{
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
}
