import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendVerifyEmailDto } from './dto/send-verify-email.dto';
import { SendResetPasswordDto } from './dto/send-reset-password.dto';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
    ) { }

    async sendEmailVerify(dto: SendVerifyEmailDto) {
        // get data from dto
        const { username, email, verificationLink } = dto
        return await this.mailerService.sendMail({
            to: email,
            subject: 'Verifikasi Email SignEase',
            template: './verify-email',
            context: {
                name: username,
                verificationLink: verificationLink,
                currentYear: new Date().getFullYear()
            }
        });
    }

    async sendEmailForgotPassword(dto: SendResetPasswordDto) {
        // get data from dto
        const { username, email, resetLink } = dto
        return await this.mailerService.sendMail({
            to: email,
            subject: 'Reset Password SignEase',
            template: './reset-password',
            context: {
                name: username,
                resetLink: resetLink,
                currentYear: new Date().getFullYear()
            }
        });
    }
}
