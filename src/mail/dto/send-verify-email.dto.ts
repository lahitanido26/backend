import { IsNotEmpty, IsString } from 'class-validator';

export class SendVerifyEmailDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    verificationLink: string;
}