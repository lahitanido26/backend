import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { MomentModule } from '@ccmos/nestjs-moment';
import { MailModule } from './mail/mail.module';
import { GatewayModule } from './gateway/gateway.module';
import { UserModule } from './user/user.module';
import { LessonModule } from './lesson/lesson.module';
import { UnitLessonModule } from './unit-lesson/unit-lesson.module';
import { PracticeModule } from './practice/practice.module';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MomentModule.forRoot({
      tz: 'Asia/Jakarta',
    }),
    AuthModule,
    PrismaModule,
    MailModule,
    GatewayModule,
    UserModule,
    LessonModule,
    UnitLessonModule,
    PracticeModule,
    QuizModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
