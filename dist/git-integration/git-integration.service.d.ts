import { PrismaService } from '../database/prisma.service';
import { ConnectRepoDto } from './dto/connect-repo.dto';
import { UpdateRepoDto, LinkPrToTaskDto } from './dto/update-repo.dto';
export declare class GitIntegrationService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private verifyProjectAccess;
    private verifyRepoAccess;
    connectRepo(dto: ConnectRepoDto, userId: string): Promise<{
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
    getReposByProject(projectId: string, userId: string): Promise<{
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
    updateRepo(repoId: string, dto: UpdateRepoDto, userId: string): Promise<{
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
    disconnectRepo(repoId: string, userId: string): Promise<{
        message: string;
    }>;
    getPullRequests(projectId: string, userId: string, opts?: {
        state?: string;
        taskId?: string;
        repoId?: string;
    }): Promise<({
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
    linkPrToTask(prId: string, dto: LinkPrToTaskDto, userId: string): Promise<{
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
    syncFromGitHub(repoId: string, userId: string): Promise<{
        synced: number;
        message: string;
    }>;
    handleWebhook(body: any, signature: string, repoFullName: string): Promise<{
        ignored: boolean;
        reason?: undefined;
        processed?: undefined;
        prNumber?: undefined;
        action?: undefined;
        taskLinked?: undefined;
    } | {
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
    }>;
    handleCiWebhook(body: any, repoFullName: string): Promise<{
        ignored: boolean;
        processed?: undefined;
        ciStatus?: undefined;
    } | {
        processed: boolean;
        ciStatus: any;
        ignored?: undefined;
    }>;
    private findTaskByBranchOrTitle;
    getProjectsWithRepos(userId: string): Promise<({
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
}
