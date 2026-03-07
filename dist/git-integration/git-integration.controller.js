"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitIntegrationController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const git_integration_service_1 = require("./git-integration.service");
const connect_repo_dto_1 = require("./dto/connect-repo.dto");
const update_repo_dto_1 = require("./dto/update-repo.dto");
let GitIntegrationController = class GitIntegrationController {
    constructor(service) {
        this.service = service;
    }
    async webhook(body, signature, event) {
        const repoFullName = body?.repository?.full_name;
        if (!repoFullName)
            return { ignored: true };
        if (event === 'ping')
            return { pong: true };
        if (event === 'pull_request') {
            return this.service.handleWebhook(body, signature, repoFullName);
        }
        if (event === 'check_run') {
            return this.service.handleCiWebhook(body, repoFullName);
        }
        return { ignored: true, event };
    }
    getProjects(req) {
        return this.service.getProjectsWithRepos(req.user.sub);
    }
    connectRepo(dto, req) {
        return this.service.connectRepo(dto, req.user.sub);
    }
    getRepos(projectId, req) {
        return this.service.getReposByProject(projectId, req.user.sub);
    }
    updateRepo(repoId, dto, req) {
        return this.service.updateRepo(repoId, dto, req.user.sub);
    }
    disconnectRepo(repoId, req) {
        return this.service.disconnectRepo(repoId, req.user.sub);
    }
    syncRepo(repoId, req) {
        return this.service.syncFromGitHub(repoId, req.user.sub);
    }
    getPullRequests(projectId, state, taskId, repoId, req) {
        return this.service.getPullRequests(projectId, req.user.sub, { state, taskId, repoId });
    }
    linkPrToTask(prId, dto, req) {
        return this.service.linkPrToTask(prId, dto, req.user.sub);
    }
};
exports.GitIntegrationController = GitIntegrationController;
__decorate([
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-hub-signature-256')),
    __param(2, (0, common_1.Headers)('x-github-event')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], GitIntegrationController.prototype, "webhook", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('projects'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GitIntegrationController.prototype, "getProjects", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('repos'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [connect_repo_dto_1.ConnectRepoDto, Object]),
    __metadata("design:returntype", void 0)
], GitIntegrationController.prototype, "connectRepo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('repos/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GitIntegrationController.prototype, "getRepos", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('repos/:repoId'),
    __param(0, (0, common_1.Param)('repoId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_repo_dto_1.UpdateRepoDto, Object]),
    __metadata("design:returntype", void 0)
], GitIntegrationController.prototype, "updateRepo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)('repos/:repoId'),
    __param(0, (0, common_1.Param)('repoId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GitIntegrationController.prototype, "disconnectRepo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('repos/:repoId/sync'),
    __param(0, (0, common_1.Param)('repoId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GitIntegrationController.prototype, "syncRepo", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('prs/:projectId'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Query)('taskId')),
    __param(3, (0, common_1.Query)('repoId')),
    __param(4, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", void 0)
], GitIntegrationController.prototype, "getPullRequests", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)('prs/:prId/link'),
    __param(0, (0, common_1.Param)('prId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_repo_dto_1.LinkPrToTaskDto, Object]),
    __metadata("design:returntype", void 0)
], GitIntegrationController.prototype, "linkPrToTask", null);
exports.GitIntegrationController = GitIntegrationController = __decorate([
    (0, common_1.Controller)('git'),
    __metadata("design:paramtypes", [git_integration_service_1.GitIntegrationService])
], GitIntegrationController);
//# sourceMappingURL=git-integration.controller.js.map