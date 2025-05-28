import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MomentModule } from '@ccmos/nestjs-moment';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { HelperModule } from '../helpers/helper.module';
import { LessonService } from './lesson.service';
import { LessonRepository } from './lesson.repository';
import { LessonController } from './lesson.controller';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({}),
        MomentModule,
        ConfigModule,
        HelperModule,
    ],
    providers: [LessonService, LessonRepository],
    controllers: [LessonController],
    exports: [LessonService, LessonRepository],
})
export class LessonModule { }