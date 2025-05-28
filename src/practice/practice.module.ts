import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MomentModule } from '@ccmos/nestjs-moment';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { HelperModule } from '../helpers/helper.module';
import { PracticeService } from './practice.service';
import { PracticeRepository } from './practice.repository';
import { PracticeController } from './practice.controller';
import { LessonModule } from '../lesson/lesson.module';
import { GatewayModule } from '../gateway/gateway.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({}),
        MomentModule,
        ConfigModule,
        HelperModule,
        LessonModule,
        GatewayModule,
        AuthModule
    ],
    providers: [PracticeService, PracticeRepository],
    controllers: [PracticeController],
    exports: [PracticeService, PracticeRepository],
})
export class PracticeModule { }