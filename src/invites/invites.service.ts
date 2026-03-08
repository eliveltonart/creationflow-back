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
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';

@Injectable()
export class InvitesService {
  private readonly logger = new Logger(InvitesService.name);

  constructor(private prisma: PrismaService) {}

  private async sendInviteEmail(
    to: string,
    inviteLink: string,
    companyName: string,
    inviterName: string,
  ) {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      this.logger.log(`[INVITE] SMTP not configured. Email would be sent to: ${to}`);
      this.logger.log(`[INVITE] Invite link: ${inviteLink}`);
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: false,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });

      await transporter.sendMail({
        from: `"CreationFlow" <${SMTP_USER}>`,
        to,
        subject: `Convite para participar de ${companyName} no CreationFlow`,
        html: `
          <h2>Você foi convidado!</h2>
          <p><strong>${inviterName}</strong> convidou você para fazer parte da equipe da empresa <strong>${companyName}</strong> no CreationFlow.</p>
          <p>Clique no botão abaixo para aceitar o convite e criar sua conta:</p>
          <a href="${inviteLink}" style="display:inline-block;padding:12px 24px;background:#2196f3;color:white;text-decoration:none;border-radius:6px;font-weight:bold;">
            Aceitar Convite
          </a>
          <p style="color:#999;font-size:12px;margin-top:24px;">Este link expira em 7 dias. Se você não esperava este convite, ignore este email.</p>
        `,
      });
      this.logger.log(`[INVITE] Email sent successfully to: ${to}`);
    } catch (error) {
      this.logger.error(`[INVITE] Failed to send email to ${to}: ${error.message}`);
      // Don't throw - invite was already created, email failure shouldn't block it
    }
  }

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

    // Check for existing pending invite
    const existingInvite = await this.prisma.invite.findFirst({
      where: { email, companyId, status: 'PENDING' },
    });
    if (existingInvite) {
      throw new BadRequestException('An invite for this email is already pending');
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

      await this.sendInviteEmail(email, inviteLink, company.name, company.user.name);

      this.logger.log(`[INVITE] Invite created successfully for ${email}`);

      return {
        message: 'Invite sent successfully',
        inviteLink,
        email,
      };
    } catch (error) {
      this.logger.error(`[INVITE] Failed to create invite: ${error.message}`, error.stack);
      throw error;
    }
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

    return this.prisma.invite.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        status: true,
        createdAt: true,
        expiresAt: true,
      },
    });
  }
}
