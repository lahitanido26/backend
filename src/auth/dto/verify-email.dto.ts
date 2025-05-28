import { IsNotEmpty, IsString, IsEmail, IsInt } from 'class-validator';


export class VerifyEmailDto {
    @IsString()
    @IsNotEmpty()
    idUser: string;

    @IsNotEmpty()
    @IsInt()
    codeVerify: number
}
