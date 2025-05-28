import { IsNotEmpty, IsString } from 'class-validator';

export class SendResetPasswordDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    resetLink: string;
}