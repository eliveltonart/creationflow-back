import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto, userId: string) {
    // Membros convidados (sem nenhuma empresa própria) não podem criar empresas
    const ownerMemberships = await this.prisma.companyMember.count({
      where: { userId, role: 'OWNER' },
    });

    if (ownerMemberships === 0) {
      throw new ForbiddenException(
        'Membros convidados não podem criar empresas',
      );
    }

    const company = await this.prisma.company.create({
      data: {
        ...createCompanyDto,
        userId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        _count: {
          select: {
            projects: true,
            members: true,
          },
        },
      },
    });

    return { ...company, myRole: 'OWNER' };
  }

  async findAll(userId: string) {
    // Busca todas as associações do usuário para determinar role por empresa
    const memberships = await this.prisma.companyMember.findMany({
      where: { userId },
      select: { companyId: true, role: true },
    });

    const memberCompanyIds = memberships.map((m) => m.companyId);
    const roleMap = new Map(memberships.map((m) => [m.companyId, m.role]));

    const companies = await this.prisma.company.findMany({
      where: {
        OR: [
          { userId },
          { id: { in: memberCompanyIds } },
        ],
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        _count: {
          select: {
            projects: true,
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return companies.map((company) => ({
      ...company,
      myRole: company.userId === userId
        ? 'OWNER'
        : (roleMap.get(company.id) ?? 'MEMBER'),
    }));
  }

  async findOne(id: string, userId: string) {
    const company = await this.prisma.company.findFirst({
      where: {
        id,
        OR: [
          { userId },
          { members: { some: { userId } } },
        ],
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
        projects: {
          include: {
            _count: {
              select: {
                tasks: true,
              },
            },
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, userId: string) {
    const company = await this.prisma.company.findFirst({
      where: { id, userId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  async remove(id: string, userId: string) {
    const company = await this.prisma.company.findFirst({
      where: { id, userId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return this.prisma.company.delete({
      where: { id },
    });
  }
}