import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
import { sendInvitationEmail } from '../utils/send-email';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class InvitesService {
  private readonly logger = new Logger(InvitesService.name);

  constructor(private prisma: PrismaService) {}

  async create(createInviteDto: CreateInviteDto, invitedById: string) {
    const { email, companyId } = createInviteDto;

    this.logger.log(`[INVITE] Creating invite for ${email} to company ${companyId} by user ${invitedById}`);

    // Verify company exists and belongs to user
    const company = await this.prisma.company.findFirst({
      where: { id: companyId, userId: invitedById },
      include: { user: true },
    });

    if (!company) {
      throw new ForbiddenException('Company not found or access denied');
    }

    // Check if user is already a member
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const alreadyMember = await this.prisma.companyMember.findUnique({
        where: { userId_companyId: { userId: existingUser.id, companyId } },
      });
      if (alreadyMember || existingUser.id === invitedById) {
        throw new BadRequestException('User is already a member of this company');
      }
    }

    // If there's an existing pending invite, delete it and create a new one (resend)
    const existingInvite = await this.prisma.invite.findFirst({
      where: { email, companyId, status: 'PENDING' },
    });
    if (existingInvite) {
      this.logger.log(`[INVITE] Removing old pending invite for ${email}, will resend`);
      await this.prisma.invite.delete({ where: { id: existingInvite.id } });
    }

    // Create invite (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    try {
      const invite = await this.prisma.invite.create({
        data: { email, companyId, invitedById, expiresAt },
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
      const inviteLink = `${frontendUrl}/invite/accept?token=${invite.token}`;

      const emailSent = await sendInvitationEmail(email, inviteLink, company.name, company.user.name);

      this.logger.log(`[INVITE] Invite created for ${email} (email sent: ${emailSent})`);

      return {
        message: emailSent ? 'Invite sent successfully' : 'Invite created (email not configured)',
        inviteLink,
        email,
      };
    } catch (error) {
      this.logger.error(`[INVITE] Failed to create invite: ${error.message}`, error.stack);
      throw error;
    }
  }

  async cancel(inviteId: string, userId: string) {
    const invite = await this.prisma.invite.findUnique({
      where: { id: inviteId },
      include: { company: true },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    // Only company owner can cancel
    if (invite.company.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (invite.status !== 'PENDING') {
      throw new BadRequestException('Only pending invites can be cancelled');
    }

    await this.prisma.invite.delete({ where: { id: inviteId } });

    this.logger.log(`[INVITE] Invite ${inviteId} cancelled by user ${userId}`);

    return { message: 'Invite cancelled successfully' };
  }

  async getByToken(token: string) {
    const invite = await this.prisma.invite.findUnique({
      where: { token },
      include: {
        company: { select: { name: true, color: true } },
        invitedBy: { select: { name: true } },
      },
    });

    if (!invite) {
      throw new NotFoundException('Invite not found');
    }

    if (invite.status !== 'PENDING') {
      throw new BadRequestException('This invite has already been used');
    }

    if (new Date() > invite.expiresAt) {
      await this.prisma.invite.update({ where: { token }, data: { status: 'EXPIRED' } });
      throw new BadRequestException('This invite has expired');
    }

    return {
      email: invite.email,
      companyName: invite.company.name,
      companyColor: invite.company.color,
      invitedBy: invite.invitedBy.name,
    };
  }

  async accept(token: string, acceptInviteDto: AcceptInviteDto) {
    const invite = await this.prisma.invite.findUnique({
      where: { token },
      include: { company: true },
    });

    if (!invite) throw new NotFoundException('Invite not found');
    if (invite.status !== 'PENDING') throw new BadRequestException('Invite already used');
    if (new Date() > invite.expiresAt) {
      await this.prisma.invite.update({ where: { token }, data: { status: 'EXPIRED' } });
      throw new BadRequestException('Invite expired');
    }

    // Get or create user
    let user = await this.prisma.user.findUnique({ where: { email: invite.email } });

    if (!user) {
      const hashedPassword = await bcrypt.hash(acceptInviteDto.password, 10);
      user = await this.prisma.user.create({
        data: {
          email: invite.email,
          name: acceptInviteDto.name,
          password: hashedPassword,
        },
      });
    }

    // Add user as company member
    await this.prisma.companyMember.upsert({
      where: { userId_companyId: { userId: user.id, companyId: invite.companyId } },
      create: { userId: user.id, companyId: invite.companyId, role: 'MEMBER' },
      update: {},
    });

    // Mark invite as accepted
    await this.prisma.invite.update({ where: { token }, data: { status: 'ACCEPTED' } });

    return {
      message: 'Invite accepted successfully',
      email: user.email,
      companyName: invite.company.name,
    };
  }

  async listByCompany(companyId: string, userId: string) {
    const company = await this.prisma.company.findFirst({
      where: { id: companyId, userId },
    });
    if (!company) throw new ForbiddenException('Access denied');

    const invites = await this.prisma.invite.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        status: true,
        createdAt: true,
        expiresAt: true,
        invitedBy: { select: { name: true, email: true } },
      },
    });

    // Auto-expire invites that have passed their expiration date
    const now = new Date();
    const results = invites.map((invite) => {
      const isExpired = invite.status === 'PENDING' && now > invite.expiresAt;
      return {
        ...invite,
        status: isExpired ? 'EXPIRED' : invite.status,
      };
    });

    // Batch update expired invites in the database
    const expiredIds = invites
      .filter((inv) => inv.status === 'PENDING' && now > inv.expiresAt)
      .map((inv) => inv.id);

    if (expiredIds.length > 0) {
      await this.prisma.invite.updateMany({
        where: { id: { in: expiredIds } },
        data: { status: 'EXPIRED' },
      });
    }

    return results;
  }
}
