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
exports.HandoffController = void 0;
const common_1 = require("@nestjs/common");
const handoff_service_1 = require("./handoff.service");
const create_handoff_dto_1 = require("./dto/create-handoff.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let HandoffController = class HandoffController {
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        return this.service.create(dto, req.user.sub);
    }
    findAll(projectId, status, req) {
        return this.service.findAll(req.user.sub, projectId, status);
    }
    getProjects(req) {
        return this.service.getAccessibleProjects(req.user.sub);
    }
    findOne(id, req) {
        return this.service.findOne(id, req.user.sub);
    }
    update(id, dto, req) {
        return this.service.update(id, dto, req.user.sub);
    }
    updateStatus(id, dto, req) {
        return this.service.updateStatus(id, dto, req.user.sub);
    }
    remove(id, req) {
        return this.service.remove(id, req.user.sub);
    }
    createComponent(id, dto, req) {
        return this.service.createComponent(id, dto, req.user.sub);
    }
    updateComponent(id, componentId, dto, req) {
        return this.service.updateComponent(id, componentId, dto, req.user.sub);
    }
    removeComponent(id, componentId, req) {
        return this.service.removeComponent(id, componentId, req.user.sub);
    }
    createComment(id, dto, req) {
        return this.service.createComment(id, dto, req.user.sub);
    }
    resolveComment(id, commentId, req) {
        return this.service.resolveComment(id, commentId, req.user.sub);
    }
    linkTasks(id, dto, req) {
        return this.service.linkTasks(id, dto, req.user.sub);
    }
    unlinkTask(id, taskId, req) {
        return this.service.unlinkTask(id, taskId, req.user.sub);
    }
};
exports.HandoffController = HandoffController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_handoff_dto_1.CreateHandoffDto, Object]),
    __metadata("design:returntype", void 0)
], HandoffController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('projectId')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], HandoffController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('projects'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], HandoffController.prototype, "getProjects", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HandoffController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_handoff_dto_1.UpdateHandoffDto, Object]),
    __metadata("design:returntype", void 0)
], HandoffController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_handoff_dto_1.UpdateHandoffStatusDto, Object]),
    __metadata("design:returntype", void 0)
], HandoffController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HandoffController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/components'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_handoff_dto_1.CreateComponentDto, Object]),
    __metadata("design:returntype", void 0)
], HandoffController.prototype, "createComponent", null);
__decorate([
    (0, common_1.Patch)(':id/components/:componentId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('componentId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_handoff_dto_1.UpdateComponentDto, Object]),
    __metadata("design:returntype", void 0)
], HandoffController.prototype, "updateComponent", null);
__decorate([
    (0, common_1.Delete)(':id/components/:componentId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('componentId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], HandoffController.prototype, "removeComponent", null);
__decorate([
    (0, common_1.Post)(':id/comments'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_handoff_dto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", void 0)
], HandoffController.prototype, "createComment", null);
__decorate([
    (0, common_1.Patch)(':id/comments/:commentId/resolve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('commentId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], HandoffController.prototype, "resolveComment", null);
__decorate([
    (0, common_1.Post)(':id/tasks'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_handoff_dto_1.LinkTaskDto, Object]),
    __metadata("design:returntype", void 0)
], HandoffController.prototype, "linkTasks", null);
__decorate([
    (0, common_1.Delete)(':id/tasks/:taskId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('taskId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], HandoffController.prototype, "unlinkTask", null);
exports.HandoffController = HandoffController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('handoffs'),
    __metadata("design:paramtypes", [handoff_service_1.HandoffService])
], HandoffController);
//# sourceMappingURL=handoff.controller.js.map