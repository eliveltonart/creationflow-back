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
exports.EmployersController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const employers_service_1 = require("./employers.service");
const employer_dto_1 = require("./dto/employer.dto");
let EmployersController = class EmployersController {
    constructor(service) {
        this.service = service;
    }
    getCompanies(req) {
        return this.service.getAccessibleCompanies(req.user.sub);
    }
    getDepartments(companyId, req) {
        return this.service.getDepartments(companyId, req.user.sub);
    }
    createDepartment(companyId, dto, req) {
        return this.service.createDepartment(companyId, dto, req.user.sub);
    }
    updateDepartment(companyId, deptId, dto, req) {
        return this.service.updateDepartment(companyId, deptId, dto, req.user.sub);
    }
    deleteDepartment(companyId, deptId, req) {
        return this.service.deleteDepartment(companyId, deptId, req.user.sub);
    }
    getPositions(companyId, req) {
        return this.service.getPositions(companyId, req.user.sub);
    }
    createPosition(companyId, dto, req) {
        return this.service.createPosition(companyId, dto, req.user.sub);
    }
    updatePosition(companyId, posId, dto, req) {
        return this.service.updatePosition(companyId, posId, dto, req.user.sub);
    }
    deletePosition(companyId, posId, req) {
        return this.service.deletePosition(companyId, posId, req.user.sub);
    }
    listMembers(companyId, req, departmentId, status, contractType, search) {
        return this.service.listMembers(companyId, req.user.sub, {
            departmentId, status, contractType, search,
        });
    }
    getOrCreateProfile(companyId, memberUserId, req) {
        return this.service.getOrCreateProfile(companyId, memberUserId, req.user.sub);
    }
    listEmployers(companyId, req, departmentId, status, contractType, search) {
        return this.service.listEmployers(companyId, req.user.sub, {
            departmentId, status, contractType, search,
        });
    }
    getEmployer(companyId, employerId, req) {
        return this.service.getEmployer(companyId, employerId, req.user.sub);
    }
    createEmployer(companyId, dto, req) {
        return this.service.createEmployer(companyId, dto, req.user.sub);
    }
    updateEmployer(companyId, employerId, dto, req) {
        return this.service.updateEmployer(companyId, employerId, dto, req.user.sub);
    }
    deleteEmployer(companyId, employerId, req) {
        return this.service.deleteEmployer(companyId, employerId, req.user.sub);
    }
    addSkill(companyId, employerId, dto, req) {
        return this.service.addSkill(companyId, employerId, dto, req.user.sub);
    }
    removeSkill(companyId, employerId, skillId, req) {
        return this.service.removeSkill(companyId, employerId, skillId, req.user.sub);
    }
    assignRole(companyId, employerId, dto, req) {
        return this.service.assignRole(companyId, employerId, dto, req.user.sub);
    }
    revokeRole(companyId, employerId, roleId, req) {
        return this.service.revokeRole(companyId, employerId, roleId, req.user.sub);
    }
};
exports.EmployersController = EmployersController;
__decorate([
    (0, common_1.Get)('companies'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "getCompanies", null);
__decorate([
    (0, common_1.Get)(':companyId/departments'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Post)(':companyId/departments'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employer_dto_1.CreateDepartmentDto, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "createDepartment", null);
__decorate([
    (0, common_1.Patch)(':companyId/departments/:deptId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('deptId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, employer_dto_1.UpdateDepartmentDto, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "updateDepartment", null);
__decorate([
    (0, common_1.Delete)(':companyId/departments/:deptId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('deptId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "deleteDepartment", null);
__decorate([
    (0, common_1.Get)(':companyId/positions'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "getPositions", null);
__decorate([
    (0, common_1.Post)(':companyId/positions'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employer_dto_1.CreatePositionDto, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "createPosition", null);
__decorate([
    (0, common_1.Patch)(':companyId/positions/:posId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('posId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, employer_dto_1.UpdatePositionDto, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "updatePosition", null);
__decorate([
    (0, common_1.Delete)(':companyId/positions/:posId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('posId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "deletePosition", null);
__decorate([
    (0, common_1.Get)(':companyId/members'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('departmentId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('contractType')),
    __param(5, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "listMembers", null);
__decorate([
    (0, common_1.Get)(':companyId/profile/:memberUserId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('memberUserId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "getOrCreateProfile", null);
__decorate([
    (0, common_1.Get)(':companyId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)('departmentId')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('contractType')),
    __param(5, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, String, String, String]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "listEmployers", null);
__decorate([
    (0, common_1.Get)(':companyId/:employerId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('employerId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "getEmployer", null);
__decorate([
    (0, common_1.Post)(':companyId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employer_dto_1.CreateEmployerDto, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "createEmployer", null);
__decorate([
    (0, common_1.Patch)(':companyId/:employerId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('employerId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, employer_dto_1.UpdateEmployerDto, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "updateEmployer", null);
__decorate([
    (0, common_1.Delete)(':companyId/:employerId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('employerId')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "deleteEmployer", null);
__decorate([
    (0, common_1.Post)(':companyId/:employerId/skills'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('employerId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, employer_dto_1.CreateSkillDto, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "addSkill", null);
__decorate([
    (0, common_1.Delete)(':companyId/:employerId/skills/:skillId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('employerId')),
    __param(2, (0, common_1.Param)('skillId')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "removeSkill", null);
__decorate([
    (0, common_1.Post)(':companyId/:employerId/roles'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('employerId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, employer_dto_1.AssignRoleDto, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "assignRole", null);
__decorate([
    (0, common_1.Delete)(':companyId/:employerId/roles/:roleId'),
    __param(0, (0, common_1.Param)('companyId')),
    __param(1, (0, common_1.Param)('employerId')),
    __param(2, (0, common_1.Param)('roleId')),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], EmployersController.prototype, "revokeRole", null);
exports.EmployersController = EmployersController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('employers'),
    __metadata("design:paramtypes", [employers_service_1.EmployersService])
], EmployersController);
//# sourceMappingURL=employers.controller.js.map