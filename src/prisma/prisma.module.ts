import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';
import { DbService } from './db.service';
import { UserQuery } from './queries/user/user.query';
import { LessonQuery } from './queries/lesson/lesson.query';
import { PracticeQuery } from './queries/practice/practice.query';
import { QuizQuery } from './queries/quiz/quiz.query';
import { UnitLessonQuery } from './queries/unit-lesson/unit-lesson.query';

@Module({
  imports: [ConfigModule],
  providers: [DbService, PrismaService, UserQuery, LessonQuery, PracticeQuery, QuizQuery, UnitLessonQuery],
  exports: [PrismaService, DbService, UserQuery, LessonQuery, PracticeQuery, QuizQuery, UnitLessonQuery],
})
export class PrismaModule { }
