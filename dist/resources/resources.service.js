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
exports.ResourcesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const encryption_service_1 = require("./encryption.service");
const create_resource_dto_1 = require("./dto/create-resource.dto");
let ResourcesService = class ResourcesService {
    constructor(db, encryption) {
        this.db = db;
        this.encryption = encryption;
    }
    async assertMember(companyId, userId) {
        const member = await this.db.companyMember.findFirst({
            where: { companyId, userId },
        });
        const owner = await this.db.company.findFirst({
            where: { id: companyId, userId },
        });
        if (!member && !owner) {
            throw new common_1.ForbiddenException('Not a member of this company');
        }
    }
    async create(dto, userId) {
        await this.assertMember(dto.companyId, userId);
        const encryptedFields = this.encryption.encryptJson(dto.fields);
        const encryptedNotes = dto.notes ? this.encryption.encrypt(dto.notes) : null;
        const resource = await this.db.resource.create({
            data: {
                name: dto.name,
                url: dto.url,
                favicon: dto.favicon,
                type: dto.type,
                fields: encryptedFields,
                notes: encryptedNotes,
                visibility: dto.visibility ?? create_resource_dto_1.ResourceVisibility.COMPANY,
                companyId: dto.companyId,
                createdById: userId,
            },
        });
        if (dto.visibility === create_resource_dto_1.ResourceVisibility.RESTRICTED &&
            dto.accessUserIds?.length) {
            await this.db.resourceAccess.createMany({
                data: dto.accessUserIds.map((uid) => ({
                    resourceId: resource.id,
                    userId: uid,
                })),
                skipDuplicates: true,
            });
        }
        return resource;
    }
    async findAllForCompany(companyId, userId) {
        await this.assertMember(companyId, userId);
        const resources = await this.db.resource.findMany({
            where: {
                companyId,
                OR: [
                    { visibility: 'COMPANY' },
                    { createdById: userId },
                    {
                        visibility: 'RESTRICTED',
                        accessList: { some: { userId } },
                    },
                ],
            },
            include: {
                createdBy: { select: { id: true, name: true, email: true } },
                accessList: { include: { user: { select: { id: true, name: true, email: true } } } },
            },
            orderBy: [{ type: 'asc' }, { name: 'asc' }],
        });
        return resources.map((r) => ({
            id: r.id,
            name: r.name,
            url: r.url,
            favicon: r.favicon,
            type: r.type,
            visibility: r.visibility,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
            createdBy: r.createdBy,
            accessList: r.accessList.map((a) => a.user),
        }));
    }
    async findOne(id, userId) {
        const resource = await this.db.resource.findUnique({
            where: { id },
            include: {
                createdBy: { select: { id: true, name: true, email: true } },
                accessList: { include: { user: { select: { id: true, name: true, email: true } } } },
            },
        });
        if (!resource)
            throw new common_1.NotFoundException('Resource not found');
        const isMember = await this.db.companyMember.findFirst({
            where: { companyId: resource.companyId, userId },
        });
        const isOwner = await this.db.company.findFirst({
            where: { id: resource.companyId, userId },
        });
        if (!isMember && !isOwner)
            throw new common_1.ForbiddenException();
        if (resource.visibility === 'RESTRICTED') {
            const canAccess = resource.createdById === userId ||
                resource.accessList.some((a) => a.userId === userId);
            if (!canAccess)
                throw new common_1.ForbiddenException('No access to this resource');
        }
        let decryptedFields = {};
        let decryptedNotes = null;
        try {
            decryptedFields = this.encryption.decryptJson(resource.fields);
        }
        catch {
            decryptedFields = {};
        }
        try {
            if (resource.notes)
                decryptedNotes = this.encryption.decrypt(resource.notes);
        }
        catch {
            decryptedNotes = null;
        }
        return {
            id: resource.id,
            name: resource.name,
            url: resource.url,
            favicon: resource.favicon,
            type: resource.type,
            visibility: resource.visibility,
            fields: decryptedFields,
            notes: decryptedNotes,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt,
            createdBy: resource.createdBy,
            accessList: resource.accessList.map((a) => a.user),
        };
    }
    async update(id, dto, userId) {
        const resource = await this.db.resource.findUnique({ where: { id } });
        if (!resource)
            throw new common_1.NotFoundException('Resource not found');
        if (resource.createdById !== userId) {
            throw new common_1.ForbiddenException('Only the creator can edit this resource');
        }
        const updateData = {};
        if (dto.name !== undefined)
            updateData.name = dto.name;
        if (dto.url !== undefined)
            updateData.url = dto.url;
        if (dto.favicon !== undefined)
            updateData.favicon = dto.favicon;
        if (dto.type !== undefined)
            updateData.type = dto.type;
        if (dto.visibility !== undefined)
            updateData.visibility = dto.visibility;
        if (dto.fields !== undefined) {
            updateData.fields = this.encryption.encryptJson(dto.fields);
        }
        if (dto.notes !== undefined) {
            updateData.notes = dto.notes ? this.encryption.encrypt(dto.notes) : null;
        }
        await this.db.resource.update({ where: { id }, data: updateData });
        if (dto.accessUserIds !== undefined) {
            await this.db.resourceAccess.deleteMany({ where: { resourceId: id } });
            if (dto.accessUserIds.length) {
                await this.db.resourceAccess.createMany({
                    data: dto.accessUserIds.map((uid) => ({ resourceId: id, userId: uid })),
                    skipDuplicates: true,
                });
            }
        }
        return this.findOne(id, userId);
    }
    async remove(id, userId) {
        const resource = await this.db.resource.findUnique({ where: { id } });
        if (!resource)
            throw new common_1.NotFoundException('Resource not found');
        if (resource.createdById !== userId) {
            throw new common_1.ForbiddenException('Only the creator can delete this resource');
        }
        await this.db.resource.delete({ where: { id } });
        return { deleted: true };
    }
    async getCompanyUsers(companyId, userId) {
        await this.assertMember(companyId, userId);
        const members = await this.db.companyMember.findMany({
            where: { companyId },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
        const owner = await this.db.company.findUnique({
            where: { id: companyId },
            include: { user: { select: { id: true, name: true, email: true } } },
        });
        const all = members.map((m) => m.user);
        if (owner && !all.find((u) => u.id === owner.userId)) {
            all.unshift(owner.user);
        }
        return all;
    }
};
exports.ResourcesService = ResourcesService;
exports.ResourcesService = ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        encryption_service_1.EncryptionService])
], ResourcesService);
//# sourceMappingURL=resources.service.js.map