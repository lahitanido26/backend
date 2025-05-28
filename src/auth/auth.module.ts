import { Module } from '@nestjs/common';
import { PrismaModule } from './../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { MomentModule } from '@ccmos/nestjs-moment';
import { ConfigModule } from '@nestjs/config';
import { HelperModule } from '../helpers/helper.module';
import { AuthRepository } from './auth.repository';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
    MomentModule,
    ConfigModule,
    HelperModule,
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule { }
