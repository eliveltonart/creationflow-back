export declare enum ResourceType {
    SITE = "SITE",
    FTP = "FTP",
    DATABASE = "DATABASE",
    LOGIN = "LOGIN",
    API_KEY = "API_KEY",
    SSH = "SSH",
    TOOL = "TOOL"
}
export declare enum ResourceVisibility {
    COMPANY = "COMPANY",
    RESTRICTED = "RESTRICTED"
}
export declare class CreateResourceDto {
    name: string;
    url?: string;
    favicon?: string;
    type: ResourceType;
    fields: Record<string, any>;
    notes?: string;
    visibility?: ResourceVisibility;
    companyId: string;
    accessUserIds?: string[];
}
