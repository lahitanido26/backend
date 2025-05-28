import { BadRequestException, Injectable } from '@nestjs/common';

import { AuthRepository } from './auth.repository';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { PayloadToken } from './type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private jwt: JwtService,
  ) { }

  async register(dto: RegisterUserDto) {
    return await this.authRepository.register(dto);
  }

  async verifyEmail(id: string, codeVerify: number) {
    return await this.authRepository.verifyEmail(id, codeVerify);
  }

  async login(dto: LoginUserDto) {
    return await this.authRepository.login(dto);
  }

  async refreshJwtToken(refreshToken: string) {
    return await this.authRepository.refreshJwtToken(refreshToken);
  }

  async changePassword(token: string, dto: ChangePasswordDto) {
    const { sub } = await this.authRepository.decodeJwtToken(token);
    return await this.authRepository.changePassword(sub, dto.password, dto.newPassword);
  }

  async getMe(token: string) {
    const { sub } = await this.authRepository.decodeJwtToken(token);
    const me = await this.authRepository.findUserByIdOrThrow(sub);
    delete me.password;
    return me
  }

  async sendForgotPassword(email: string) {
    return await this.authRepository.sendForgotPassword(email);
  }

  async resetPassword(token: string, newPassword: string) {
    const { sub } = await this.authRepository.decodeJwtToken(token);
    return await this.authRepository.resetPassword(sub, newPassword);
  }

  async findUserByIdOrThrow(id: string) {
    return await this.authRepository.findUserByIdOrThrow(id);
  }

  async verifyForgotPassword(id: string, codeVerify: number) {
    return await this.authRepository.verifyForgotPassword(id, codeVerify);
  }

  /*
  |--------------------------------------------------------------------------
  | Admin Service
  |--------------------------------------------------------------------------
  */

  async registerAdmin(dto: RegisterUserDto) {
    return await this.authRepository.registerAdmin(dto);
  }


  async loginAdmin(dto: LoginUserDto) {
    return await this.authRepository.loginAdmin(dto);
  }

  /*
    |--------------------------------------------------------------------------
    | Helper Auth
    |--------------------------------------------------------------------------
    */
  async decodeJwtToken(accessToken: string) {
    const decodedJwt = this.jwt.decode(
      accessToken.split(' ')[1],
    ) as PayloadToken;
    return decodedJwt;
  }

}
