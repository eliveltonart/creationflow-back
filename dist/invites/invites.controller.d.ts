import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { AcceptInviteDto } from './dto/accept-invite.dto';
export declare class InvitesController {
    private readonly invitesService;
    constructor(invitesService: InvitesService);
    create(createInviteDto: CreateInviteDto, req: any): Promise<{
        message: string;
        inviteLink: string;
        email: string;
    }>;
    cancel(id: string, req: any): Promise<{
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
    listByCompany(companyId: string, req: any): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.InviteStatus;
        expiresAt: Date;
    }[]>;
}
