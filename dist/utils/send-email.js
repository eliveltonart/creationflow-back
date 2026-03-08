"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
exports.sendInvitationEmail = sendInvitationEmail;
const nodemailer = require("nodemailer");
let transporter = null;
function getTransporter() {
    if (transporter)
        return transporter;
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST) {
        return null;
    }
    const config = {
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: Number(SMTP_PORT) === 465,
        tls: { rejectUnauthorized: false },
    };
    if (SMTP_USER && SMTP_PASS) {
        config.auth = { user: SMTP_USER, pass: SMTP_PASS };
    }
    transporter = nodemailer.createTransport(config);
    return transporter;
}
function getFromAddress() {
    const { SMTP_FROM, SMTP_USER } = process.env;
    return SMTP_FROM || SMTP_USER || 'noreply@creationflow.app';
}
async function sendEmail(options) {
    const mail = getTransporter();
    if (!mail) {
        console.warn(`[EMAIL] SMTP not configured. Would send to: ${options.to}`);
        return false;
    }
    try {
        const info = await mail.sendMail({
            from: `"CreationFlow" <${getFromAddress()}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        });
        console.log(`[EMAIL] Sent to ${options.to}: ${info.response}`);
        return true;
    }
    catch (error) {
        console.error(`[EMAIL] Failed to send to ${options.to}:`, error.message);
        return false;
    }
}
async function sendInvitationEmail(email, inviteLink, companyName, inviterName) {
    return sendEmail({
        to: email,
        subject: `Convite para participar de ${companyName} no CreationFlow`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Você foi convidado!</h2>
        <p><strong>${inviterName}</strong> convidou você para fazer parte da equipe da empresa <strong>${companyName}</strong> no CreationFlow.</p>
        <p>Clique no botão abaixo para aceitar o convite e criar sua conta:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${inviteLink}" style="display:inline-block;padding:14px 28px;background:#2196f3;color:white;text-decoration:none;border-radius:6px;font-weight:bold;font-size:16px;">
            Aceitar Convite
          </a>
        </div>
        <p style="color:#999;font-size:12px;margin-top:24px;">Este link expira em 7 dias. Se você não esperava este convite, ignore este email.</p>
      </div>
    `,
    });
}
//# sourceMappingURL=send-email.js.map