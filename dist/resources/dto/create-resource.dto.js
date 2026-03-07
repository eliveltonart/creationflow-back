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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateResourceDto = exports.ResourceVisibility = exports.ResourceType = void 0;
const class_validator_1 = require("class-validator");
var ResourceType;
(function (ResourceType) {
    ResourceType["SITE"] = "SITE";
    ResourceType["FTP"] = "FTP";
    ResourceType["DATABASE"] = "DATABASE";
    ResourceType["LOGIN"] = "LOGIN";
    ResourceType["API_KEY"] = "API_KEY";
    ResourceType["SSH"] = "SSH";
    ResourceType["TOOL"] = "TOOL";
})(ResourceType || (exports.ResourceType = ResourceType = {}));
var ResourceVisibility;
(function (ResourceVisibility) {
    ResourceVisibility["COMPANY"] = "COMPANY";
    ResourceVisibility["RESTRICTED"] = "RESTRICTED";
})(ResourceVisibility || (exports.ResourceVisibility = ResourceVisibility = {}));
class CreateResourceDto {
}
exports.CreateResourceDto = CreateResourceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResourceDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResourceDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResourceDto.prototype, "favicon", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(ResourceType),
    __metadata("design:type", String)
], CreateResourceDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateResourceDto.prototype, "fields", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResourceDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ResourceVisibility),
    __metadata("design:type", String)
], CreateResourceDto.prototype, "visibility", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateResourceDto.prototype, "companyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateResourceDto.prototype, "accessUserIds", void 0);
//# sourceMappingURL=create-resource.dto.js.map