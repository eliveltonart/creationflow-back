import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { EncryptionService } from './encryption.service';import { CreateResourceDto, ResourceVisibility } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class ResourcesService {
  constructor(
    private db: PrismaService,
    private encryption: EncryptionService,
  ) {}

  /** Check if user can access a resource (must be company member or have explicit access) */
  private async assertMember(companyId: string, userId: string) {
    const member = await this.db.companyMember.findFirst({
      where: { companyId, userId },
    });
    const owner = await this.db.company.findFirst({
      where: { id: companyId, userId },
    });
    if (!member && !owner) {
      throw new ForbiddenException('Not a member of this company');
    }
  }

  async create(dto: CreateResourceDto, userId: string) {
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
        visibility: dto.visibility ?? ResourceVisibility.COMPANY,
        companyId: dto.companyId,
        createdById: userId,
      },
    });

    // If RESTRICTED, add access entries
    if (
      dto.visibility === ResourceVisibility.RESTRICTED &&
      dto.accessUserIds?.length
    ) {
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

  async findAllForCompany(companyId: string, userId: string) {
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

    // Return without decrypted fields in the list (only metadata)
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

  async findOne(id: string, userId: string) {
    const resource = await this.db.resource.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        accessList: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });
    if (!resource) throw new NotFoundException('Resource not found');

    // Access check
    const isMember = await this.db.companyMember.findFirst({
      where: { companyId: resource.companyId, userId },
    });
    const isOwner = await this.db.company.findFirst({
      where: { id: resource.companyId, userId },
    });
    if (!isMember && !isOwner) throw new ForbiddenException();

    if (resource.visibility === 'RESTRICTED') {
      const canAccess =
        resource.createdById === userId ||
        resource.accessList.some((a) => a.userId === userId);
      if (!canAccess) throw new ForbiddenException('No access to this resource');
    }

    // Decrypt
    let decryptedFields: Record<string, any> = {};
    let decryptedNotes: string | null = null;
    try {
      decryptedFields = this.encryption.decryptJson(resource.fields);
    } catch {
      decryptedFields = {};
    }
    try {
      if (resource.notes) decryptedNotes = this.encryption.decrypt(resource.notes);
    } catch {
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

  async update(id: string, dto: UpdateResourceDto, userId: string) {
    const resource = await this.db.resource.findUnique({ where: { id } });
    if (!resource) throw new NotFoundException('Resource not found');
    if (resource.createdById !== userId) {
      throw new ForbiddenException('Only the creator can edit this resource');
    }

    const updateData: any = {};
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.url !== undefined) updateData.url = dto.url;
    if (dto.favicon !== undefined) updateData.favicon = dto.favicon;
    if (dto.type !== undefined) updateData.type = dto.type;
    if (dto.visibility !== undefined) updateData.visibility = dto.visibility;
    if (dto.fields !== undefined) {
      updateData.fields = this.encryption.encryptJson(dto.fields);
    }
    if (dto.notes !== undefined) {
      updateData.notes = dto.notes ? this.encryption.encrypt(dto.notes) : null;
    }

    await this.db.resource.update({ where: { id }, data: updateData });

    // Update access list if RESTRICTED
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

  async remove(id: string, userId: string) {
    const resource = await this.db.resource.findUnique({ where: { id } });
    if (!resource) throw new NotFoundException('Resource not found');
    if (resource.createdById !== userId) {
      throw new ForbiddenException('Only the creator can delete this resource');
    }
    await this.db.resource.delete({ where: { id } });
    return { deleted: true };
  }

  /** Get all users in the same company (for access list management) */
  async getCompanyUsers(companyId: string, userId: string) {
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
}
