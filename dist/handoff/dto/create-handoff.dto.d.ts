export declare enum HandoffStatus {
    DRAFT = "DRAFT",
    READY = "READY",
    IMPLEMENTING = "IMPLEMENTING",
    IMPLEMENTED = "IMPLEMENTED",
    APPROVED = "APPROVED",
    ARCHIVED = "ARCHIVED"
}
export declare class CreateHandoffDto {
    title: string;
    description?: string;
    projectId: string;
    developerId?: string;
    rationale?: string;
    userJourneyContext?: string;
}
export declare class UpdateHandoffDto {
    title?: string;
    description?: string;
    developerId?: string;
    rationale?: string;
    userJourneyContext?: string;
    gapValidationErrors?: boolean;
    gapValidationErrorsNA?: boolean;
    gapErrorPages?: boolean;
    gapErrorPagesNA?: boolean;
    gapAlerts?: boolean;
    gapAlertsNA?: boolean;
    gapLoadingStates?: boolean;
    gapLoadingStatesNA?: boolean;
    gapEmptyStates?: boolean;
    gapEmptyStatesNA?: boolean;
    gapComponentStates?: boolean;
    gapComponentStatesNA?: boolean;
    gapPasswordReset?: boolean;
    gapPasswordResetNA?: boolean;
    gapResponsive?: boolean;
    gapResponsiveNA?: boolean;
}
export declare class UpdateHandoffStatusDto {
    status: HandoffStatus;
}
export declare class CreateComponentDto {
    name: string;
    description?: string;
    usage?: string;
    figmaLink?: string;
    notes?: string;
    variants?: any[];
    states?: any[];
    styles?: any[];
    responsiveSpecs?: any;
    accessibilityNotes?: string;
    wcagLevel?: string;
    codeSnippets?: any[];
    order?: number;
}
export declare class UpdateComponentDto extends CreateComponentDto {
}
export declare class CreateCommentDto {
    text: string;
    componentId?: string;
    parentId?: string;
}
export declare class LinkTaskDto {
    taskIds: string[];
}
