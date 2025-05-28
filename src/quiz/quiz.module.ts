import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MomentModule } from '@ccmos/nestjs-moment';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { HelperModule } from '../helpers/helper.module';
import { QuizService } from './quiz.service';
import { QuizRepository } from './quiz.repository';
import { QuizController } from './quiz.controller';
import { LessonModule } from '../lesson/lesson.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        PrismaModule,
        JwtModule.register({}),
        MomentModule,
        ConfigModule,
        HelperModule,
        LessonModule,
        AuthModule
    ],
    providers: [QuizService, QuizRepository],
    controllers: [QuizController],
    exports: [QuizService, QuizRepository],
})
export class QuizModule { }