import { GitIntegrationService } from './git-integration.service';
import { ConnectRepoDto } from './dto/connect-repo.dto';
import { UpdateRepoDto, LinkPrToTaskDto } from './dto/update-repo.dto';
export declare class GitIntegrationController {
    private readonly service;
    constructor(service: GitIntegrationService);
    webhook(body: any, signature: string, event: string): Promise<{
        ignored: boolean;
        reason: string;
        processed?: undefined;
        prNumber?: undefined;
        action?: undefined;
        taskLinked?: undefined;
    } | {
        processed: boolean;
        prNumber: any;
        action: string;
        taskLinked: boolean;
        ignored?: undefined;
        reason?: undefined;
    } | {
        processed: boolean;
        ciStatus: any;
        ignored?: undefined;
    } | {
        ignored: boolean;
        pong?: undefined;
        event?: undefined;
    } | {
        pong: boolean;
        ignored?: undefined;
        event?: undefined;
    } | {
        ignored: boolean;
        event: string;
        pong?: undefined;
    }>;
    getProjects(req: any): Promise<({
        company: {
            name: string;
            id: string;
        };
        repositories: {
            id: string;
            _count: {
                pullRequests: number;
            };
            isActive: boolean;
            repoFullName: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        customFields: import("@prisma/client/runtime/library").JsonValue | null;
        color: string | null;
        userId: string;
        companyId: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        client: string | null;
        responsible: string | null;
        startDate: Date | null;
        endDate: Date | null;
        budget: number | null;
    })[]>;
    connectRepo(dto: ConnectRepoDto, req: any): Promise<{
        accessToken: string;
        webhookUrl: string;
        webhookSecret: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        isActive: boolean;
        repoFullName: string;
        defaultBranch: string;
        prOpenedStatus: string;
        prMergedStatus: string;
        prClosedStatus: string | null;
    }>;
    getRepos(projectId: string, req: any): Promise<{
        accessToken: string;
        _count: {
            pullRequests: number;
        };
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        isActive: boolean;
        repoFullName: string;
        defaultBranch: string;
        prOpenedStatus: string;
        prMergedStatus: string;
        prClosedStatus: string | null;
        webhookSecret: string | null;
    }[]>;
    updateRepo(repoId: string, dto: UpdateRepoDto, req: any): Promise<{
        accessToken: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        projectId: string;
        isActive: boolean;
        repoFullName: string;
        defaultBranch: string;
        prOpenedStatus: string;
        prMergedStatus: string;
        prClosedStatus: string | null;
        webhookSecret: string | null;
    }>;
    disconnectRepo(repoId: string, req: any): Promise<{
        message: string;
    }>;
    syncRepo(repoId: string, req: any): Promise<{
        synced: number;
        message: string;
    }>;
    getPullRequests(projectId: string, state: string, taskId: string, repoId: string, req: any): Promise<({
        task: {
            id: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            title: string;
        };
        repository: {
            id: string;
            repoFullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taskId: string | null;
        prNumber: number;
        prTitle: string;
        prUrl: string;
        branch: string;
        baseBranch: string;
        state: string;
        author: string;
        authorAvatar: string | null;
        ciStatus: string | null;
        mergedAt: Date | null;
        closedAt: Date | null;
        repositoryId: string;
    })[]>;
    linkPrToTask(prId: string, dto: LinkPrToTaskDto, req: any): Promise<{
        task: {
            id: string;
            status: import(".prisma/client").$Enums.TaskStatus;
            title: string;
        };
        repository: {
            id: string;
            repoFullName: string;
            prMergedStatus: string;
            prClosedStatus: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        taskId: string | null;
        prNumber: number;
        prTitle: string;
        prUrl: string;
        branch: string;
        baseBranch: string;
        state: string;
        author: string;
        authorAvatar: string | null;
        ciStatus: string | null;
        mergedAt: Date | null;
        closedAt: Date | null;
        repositoryId: string;
    }>;
}
