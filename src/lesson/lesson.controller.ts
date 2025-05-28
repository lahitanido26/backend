import {
    Body,
    Controller,
    Get,
    Put,
    HttpStatus,
    Param,
    Post,
    Res,
    Delete,
    Query,
    UseGuards,
    Headers,
    BadRequestException,
} from '@nestjs/common';
import { HttpHelper } from '../helpers/http-helper';
import { LessonService } from './lesson.service';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { TypeRoleAdmin } from '@prisma/client';
import { Roles } from '../auth/decorator';
import { CreateLessonDto, UpdateLessonDto } from './dto/create-lesson.dto';
import { isValidObjectId } from '../helpers/helper';

@Controller('lesson')
export class LessonController {
    constructor(
        private readonly lessonService: LessonService,
        private readonly httpHelper: HttpHelper,
    ) { }

    @Post()
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleAdmin.ADMIN, TypeRoleAdmin.SUPER_ADMIN)
    async createLesson(@Body() dto: CreateLessonDto, @Res() res) {
        const result = await this.lessonService.createLesson(dto)
        return this.httpHelper.formatResponse(res, HttpStatus.CREATED, result)
    }

    @Put(":id")
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleAdmin.ADMIN, TypeRoleAdmin.SUPER_ADMIN)
    async updateLesson(@Body() dto: UpdateLessonDto, @Res() res, @Param("id") id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID');
        }
        await this.lessonService.updateLesson(id, dto);
        return this.httpHelper.formatResponse(res, HttpStatus.OK, {})
    }

    @Delete(":id")
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleAdmin.ADMIN, TypeRoleAdmin.SUPER_ADMIN)
    async deleteLesson(@Res() res, @Param("id") id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID');
        }
        await this.lessonService.deleteLesson(id);
        return this.httpHelper.formatResponse(res, HttpStatus.OK, {})
    }

    @Get()
    async getAllLesson(@Res() res) {
        const result = await this.lessonService.findAllLessons()
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
    }

    @Get("slug/:slug")
    async getOneLessonBySlug(@Res() res, @Param("slug") slug: string) {
        const result = await this.lessonService.findLessonBySlug(slug)
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
    }

    @Get(":id")
    async getOneLesson(@Res() res, @Param("id") id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID');
        }
        const result = await this.lessonService.findLessonById(id)
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
    }
}