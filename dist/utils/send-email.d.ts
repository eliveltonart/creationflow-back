export interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}
export declare function sendEmail(options: SendEmailOptions): Promise<boolean>;
export declare function sendInvitationEmail(email: string, inviteLink: string, companyName: string, inviterName: string): Promise<boolean>;
