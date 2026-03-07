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
exports.InvitesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
let InvitesService = class InvitesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendInviteEmail(to, inviteLink, companyName, inviterName) {
        const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
        if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
            console.log(`\n[INVITE] Email would be sent to: ${to}`);
            console.log(`[INVITE] Invite link: ${inviteLink}\n`);
            return;
        }
        const transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT) || 587,
            secure: false,
            auth: { user: SMTP_USER, pass: SMTP_PASS },
        });
        await transporter.sendMail({
            from: `"FreelancerPM" <${SMTP_USER}>`,
            to,
            subject: `Convite para participar de ${companyName} no FreelancerPM`,
            html: `
        <h2>Você foi convidado!</h2>
        <p><strong>${inviterName}</strong> convidou você para fazer parte da equipe da empresa <strong>${companyName}</strong> no FreelancerPM.</p>
        <p>Clique no botão abaixo para aceitar o convite e criar sua conta:</p>
        <a href="${inviteLink}" style="display:inline-block;padding:12px 24px;background:#2196f3;color:white;text-decoration:none;border-radius:6px;font-weight:bold;">
          Aceitar Convite
        </a>
        <p style="color:#999;font-size:12px;margin-top:24px;">Este link expira em 7 dias. Se você não esperava este convite, ignore este email.</p>
      `,
        });
    }
    async create(createInviteDto, invitedById) {
        const { email, companyId } = createInviteDto;
        const company = await this.prisma.company.findFirst({
            where: { id: companyId, userId: invitedById },
            include: { user: true },
        });
        if (!company) {
            throw new common_1.ForbiddenException('Company not found or access denied');
        }
        const existingUser = await this.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            const alreadyMember = await this.prisma.companyMember.findUnique({
                where: { userId_companyId: { userId: existingUser.id, companyId } },
            });
            if (alreadyMember || existingUser.id === invitedById) {
                throw new common_1.BadRequestException('User is already a member of this company');
            }
        }
        const existingInvite = await this.prisma.invite.findFirst({
            where: { email, companyId, status: 'PENDING' },
        });
        if (existingInvite) {
            throw new common_1.BadRequestException('An invite for this email is already pending');
        }
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const invite = await this.prisma.invite.create({
            data: { email, companyId, invitedById, expiresAt },
        });
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3002';
        const inviteLink = `${frontendUrl}/invite/accept?token=${invite.token}`;
        await this.sendInviteEmail(email, inviteLink, company.name, company.user.name);
        return {
            message: 'Invite sent successfully',
            inviteLink,
            email,
        };
    }
    async getByToken(token) {
        const invite = await this.prisma.invite.findUnique({
            where: { token },
            include: {
                company: { select: { name: true, color: true } },
                invitedBy: { select: { name: true } },
            },
        });
        if (!invite) {
            throw new common_1.NotFoundException('Invite not found');
        }
        if (invite.status !== 'PENDING') {
            throw new common_1.BadRequestException('This invite has already been used');
        }
        if (new Date() > invite.expiresAt) {
            await this.prisma.invite.update({ where: { token }, data: { status: 'EXPIRED' } });
            throw new common_1.BadRequestException('This invite has expired');
        }
        return {
            email: invite.email,
            companyName: invite.company.name,
            companyColor: invite.company.color,
            invitedBy: invite.invitedBy.name,
        };
    }
    async accept(token, acceptInviteDto) {
        const invite = await this.prisma.invite.findUnique({
            where: { token },
            include: { company: true },
        });
        if (!invite)
            throw new common_1.NotFoundException('Invite not found');
        if (invite.status !== 'PENDING')
            throw new common_1.BadRequestException('Invite already used');
        if (new Date() > invite.expiresAt) {
            await this.prisma.invite.update({ where: { token }, data: { status: 'EXPIRED' } });
            throw new common_1.BadRequestException('Invite expired');
        }
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
        await this.prisma.companyMember.upsert({
            where: { userId_companyId: { userId: user.id, companyId: invite.companyId } },
            create: { userId: user.id, companyId: invite.companyId, role: 'MEMBER' },
            update: {},
        });
        await this.prisma.invite.update({ where: { token }, data: { status: 'ACCEPTED' } });
        return {
            message: 'Invite accepted successfully',
            email: user.email,
            companyName: invite.company.name,
        };
    }
    async listByCompany(companyId, userId) {
        const company = await this.prisma.company.findFirst({
            where: { id: companyId, userId },
        });
        if (!company)
            throw new common_1.ForbiddenException('Access denied');
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
};
exports.InvitesService = InvitesService;
exports.InvitesService = InvitesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InvitesService);
//# sourceMappingURL=invites.service.js.map