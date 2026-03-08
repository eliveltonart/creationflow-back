import { PrismaService } from '../database/prisma.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
export declare class InvitesService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private sendInviteEmail;
    create(createInviteDto: CreateInviteDto, invitedById: string): Promise<{
        message: string;
        inviteLink: string;
        email: string;
    }>;
    cancel(inviteId: string, userId: string): Promise<{
        message: string;
    }>;
    getByToken(token: string): Promise<{
        email: string;
        companyName: string;
        companyColor: string;
        invitedBy: string;
    }>;
    accept(token: string, acceptInviteDto: AcceptInviteDto): Promise<{
        message: string;
        email: string;
        companyName: string;
    }>;
    listByCompany(companyId: string, userId: string): Promise<{
        status: import(".prisma/client").$Enums.InviteStatus;
        email: string;
        id: string;
        createdAt: Date;
        expiresAt: Date;
        invitedBy: {
            email: string;
            name: string;
        };
    }[]>;
}
