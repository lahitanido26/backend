import { Module } from '@nestjs/common';
import { HttpHelper } from './http-helper';
import { PrismaModule } from '../prisma/prisma.module';
import { DateHelper } from './date-helper';

@Module({
  imports: [PrismaModule],
  providers: [HttpHelper, DateHelper],
  exports: [HttpHelper, DateHelper],
})
export class HelperModule { }
