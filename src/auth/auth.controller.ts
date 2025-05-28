import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  Headers,
  Patch,
  Query,
  Render,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpHelper } from '../helpers/http-helper';
import { AccessGuard, JwtGuard, RoleGuard } from './guard';
import { Access, Roles } from './decorator';
import { TokenType } from '../helpers/helper';
import { LoginUserDto } from './dto/login-user.dto';
import { Request } from 'express'
import { RegisterUserDto } from './dto/register-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { TypeRoleUser } from '@prisma/client';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly httpHelper: HttpHelper,
  ) { }

  @Post('register')
  async register(@Body() dto: RegisterUserDto, @Res() res) {
    await this.authService.register(dto);
    return this.httpHelper.formatResponse(res, HttpStatus.CREATED, {})
  }

  @Get('verify')
  @Render('verify-email-success')
  async verifyEmail(@Query() dto: VerifyEmailDto) {
    await this.authService.verifyEmail(dto.idUser, dto.codeVerify);
  }


  @Post('login')
  async login(@Body() dto: LoginUserDto, @Res() res) {
    const result = await this.authService.login(dto);
    return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
  }

  @Post('forgot-password')
  async sendForgotPassword(@Body() dto: ForgotPasswordDto, @Res() res) {
    await this.authService.sendForgotPassword(dto.email);
    return this.httpHelper.formatResponse(res, HttpStatus.OK, {})
  }

  @Get('forgot-password')
  @Render('reset-password')
  async forgotPassword(@Query() dto: VerifyEmailDto) {
    const result = await this.authService.verifyForgotPassword(dto.idUser, dto.codeVerify);
    const resetPasswordToken = result.access_token;
    return { resetPasswordToken }
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(TypeRoleUser.USER)
  @Access(TokenType.BRANCH)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto, @Res() res, @Headers("authorization") authorization: string) {
    await this.authService.resetPassword(authorization, dto.newPassword);
    return this.httpHelper.formatResponse(res, HttpStatus.OK, {})
  }

  @Post('change-password')
  @UseGuards(JwtGuard, RoleGuard)
  @Roles(TypeRoleUser.USER)
  @Access(TokenType.FULL)
  async changePassword(@Body() dto: ChangePasswordDto, @Res() res, @Headers("authorization") authorization: string) {
    await this.authService.changePassword(authorization, dto);
    return this.httpHelper.formatResponse(res, HttpStatus.OK, {})
  }

  @Get('me')
  @UseGuards(JwtGuard, RoleGuard)
  @Roles(TypeRoleUser.USER)
  @Access(TokenType.FULL)
  async getMe(@Res() res, @Headers("authorization") authorization: string) {
    const result = await this.authService.getMe(authorization);
    return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
  }

  /*
    |--------------------------------------------------------------------------
    | Auth admin enpoint
    |--------------------------------------------------------------------------
    */
  @Post('admin/register')
  async registerAdmin(@Body() dto: RegisterUserDto, @Res() res) {
    await this.authService.registerAdmin(dto);
    return this.httpHelper.formatResponse(res, HttpStatus.CREATED, {})
  }

  @Post('admin/login')
  async loginAdmin(@Body() dto: LoginUserDto, @Res() res) {
    const result = await this.authService.loginAdmin(dto);
    return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
  }

  /*
   |--------------------------------------------------------------------------
   | Auth helper function
   |--------------------------------------------------------------------------
   */

  @UseGuards(JwtGuard, AccessGuard)
  @Access(TokenType.FULL)
  @Post('refresh/token')
  refreshJwtToken(@Req() req: Request) {
    return this.authService.refreshJwtToken(req.headers.authorization)
  }
}
