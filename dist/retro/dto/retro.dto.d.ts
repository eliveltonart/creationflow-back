export declare enum RetroStatus {
    DRAFT = "DRAFT",
    COLECT = "COLECT",
    VOTE = "VOTE",
    ACT = "ACT",
    CLOSED = "CLOSED"
}
export declare enum RetroCardCategory {
    WENT_WELL = "WENT_WELL",
    NEEDS_IMPROVEMENT = "NEEDS_IMPROVEMENT",
    ACTION_ITEMS = "ACTION_ITEMS"
}
export declare class CreateRetroDto {
    title: string;
    description?: string;
    projectId: string;
    sprintId?: string;
    taskId?: string;
    isAnonymous?: boolean;
    voteLimit?: number;
    col1Name?: string;
    col1Color?: string;
    col2Name?: string;
    col2Color?: string;
    col3Name?: string;
    col3Color?: string;
}
export declare class UpdateRetroDto {
    title?: string;
    description?: string;
    col1Name?: string;
    col1Color?: string;
    col2Name?: string;
    col2Color?: string;
    col3Name?: string;
    col3Color?: string;
    isAnonymous?: boolean;
    voteLimit?: number;
}
export declare class AdvancePhaseDto {
}
export declare class CreateCardDto {
    content: string;
    category: RetroCardCategory;
    guestId?: string;
    guestName?: string;
    authorName?: string;
}
export declare class UpdateCardDto {
    content?: string;
    category?: RetroCardCategory;
}
export declare class VoteCardDto {
    points?: number;
    guestId?: string;
}
export declare class CreateActionDto {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
    assigneeId?: string;
    cardId: string;
    createTask?: boolean;
    taskProjectId?: string;
    taskSprintId?: string;
}
export declare class JoinRetroDto {
    name: string;
    guestId?: string;
}
