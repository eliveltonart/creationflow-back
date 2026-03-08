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
exports.RetroController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const retro_service_1 = require("./retro.service");
const retro_dto_1 = require("./dto/retro.dto");
let RetroController = class RetroController {
    constructor(retroService) {
        this.retroService = retroService;
    }
    getByShareToken(token) {
        return this.retroService.findByShareToken(token);
    }
    joinViaShare(token, dto) {
        return this.retroService.joinRetroByToken(token, dto);
    }
    addCardViaShare(token, dto) {
        return this.retroService.createCardByToken(token, dto);
    }
    voteViaShare(token, cardId, dto) {
        return this.retroService.voteCardByToken(token, cardId, dto);
    }
    getProjects(req) {
        return this.retroService.getProjects(req.user.sub);
    }
    getProjectSprints(projectId, req) {
        return this.retroService.getProjectSprints(projectId, req.user.sub);
    }
    findAll(req, projectId, status) {
        return this.retroService.findAll(req.user.sub, projectId, status);
    }
    create(dto, req) {
        return this.retroService.create(dto, req.user.sub);
    }
    findOne(id, req) {
        return this.retroService.findOne(id, req.user.sub);
    }
    update(id, dto, req) {
        return this.retroService.update(id, dto, req.user.sub);
    }
    remove(id, req) {
        return this.retroService.delete(id, req.user.sub);
    }
    advancePhase(id, req) {
        return this.retroService.advancePhase(id, req.user.sub);
    }
    revokeShareToken(id, req) {
        return this.retroService.revokeShareToken(id, req.user.sub);
    }
    joinRetro(id, dto, req) {
        return this.retroService.joinRetro(id, dto, req.user.sub);
    }
    createCard(id, dto, req) {
        return this.retroService.createCard(id, dto, req.user.sub);
    }
    updateCard(id, cardId, dto, req) {
        return this.retroService.updateCard(id, cardId, dto, req.user.sub);
    }
    deleteCard(id, cardId, req) {
        return this.retroService.deleteCard(id, cardId, req.user.sub);
    }
    voteCard(id, cardId, dto, req) {
        return this.retroService.voteCard(id, cardId, dto, req.user.sub);
    }
    removeVote(id, cardId, req) {
        return this.retroService.removeVote(id, cardId, req.user.sub);
    }
    createAction(id, dto, req) {
        return this.retroService.createAction(id, dto, req.user.sub);
    }
};
exports.RetroController = RetroController;
__decorate([
    (0, common_1.Get)('share/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "getByShareToken", null);
__decorate([
    (0, common_1.Post)('share/:token/join'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, retro_dto_1.JoinRetroDto]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "joinViaShare", null);
__decorate([
    (0, common_1.Post)('share/:token/cards'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, retro_dto_1.CreateCardDto]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "addCardViaShare", null);
__decorate([
    (0, common_1.Post)('share/:token/cards/:cardId/votes'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Param)('cardId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, retro_dto_1.VoteCardDto]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "voteViaShare", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('projects'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "getProjects", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('projects/:projectId/sprints'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "getProjectSprints", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('projectId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [retro_dto_1.CreateRetroDto, Object]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, retro_dto_1.UpdateRetroDto, Object]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "update", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/advance'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "advancePhase", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/share/revoke'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "revokeShareToken", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/join'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, retro_dto_1.JoinRetroDto, Object]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "joinRetro", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/cards'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, retro_dto_1.CreateCardDto, Object]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "createCard", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id/cards/:cardId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('cardId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, retro_dto_1.UpdateCardDto, Object]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "updateCard", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id/cards/:cardId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('cardId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "deleteCard", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/cards/:cardId/votes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('cardId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, retro_dto_1.VoteCardDto, Object]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "voteCard", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Delete)(':id/cards/:cardId/votes'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('cardId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "removeVote", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(':id/actions'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, retro_dto_1.CreateActionDto, Object]),
    __metadata("design:returntype", void 0)
], RetroController.prototype, "createAction", null);
exports.RetroController = RetroController = __decorate([
    (0, common_1.Controller)('retros'),
    __metadata("design:paramtypes", [retro_service_1.RetroService])
], RetroController);
//# sourceMappingURL=retro.controller.js.map