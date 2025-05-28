import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.username === undefined)
  email?: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((o) => o.email === undefined)
  username?: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
