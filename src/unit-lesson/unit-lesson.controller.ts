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
import { UnitLessonService } from './unit-lesson.service';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { Roles } from '../auth/decorator';
import { TypeRoleAdmin } from '@prisma/client';
import { isValidObjectId } from '../helpers/helper';
import { CreateUnitLessonDto, UpdateUnitLessonDto } from './dto/create-unit-lesson.dto';

@Controller('unit-lesson')
export class UnitLessonController {
    constructor(
        private readonly unitLessonService: UnitLessonService,
        private readonly httpHelper: HttpHelper,
    ) { }

    @Post()
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleAdmin.ADMIN, TypeRoleAdmin.SUPER_ADMIN)
    async createUnitLesson(@Body() dto: CreateUnitLessonDto, @Res() res) {
        const result = await this.unitLessonService.createUnitLesson(dto)
        return this.httpHelper.formatResponse(res, HttpStatus.CREATED, result)
    }

    @Put(":id")
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleAdmin.ADMIN, TypeRoleAdmin.SUPER_ADMIN)
    async updateUnitLesson(@Body() dto: UpdateUnitLessonDto, @Res() res, @Param("id") id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID');
        }
        await this.unitLessonService.updateUnitLesson(id, dto);
        return this.httpHelper.formatResponse(res, HttpStatus.OK, {})
    }

    @Delete(":id")
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleAdmin.ADMIN, TypeRoleAdmin.SUPER_ADMIN)
    async deleteUnitLesson(@Res() res, @Param("id") id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID');
        }
        await this.unitLessonService.deleteUnitLesson(id);
        return this.httpHelper.formatResponse(res, HttpStatus.OK, {})
    }

    @Get()
    async getAllUnitLesson(@Res() res) {
        const result = await this.unitLessonService.findAllUnitLessons()
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
    }

    @Get("slug/:slug")
    async getOneUnitLessonBySlug(@Res() res, @Param("slug") slug: string) {
        const result = await this.unitLessonService.findUnitLessonBySlug(slug)
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
    }

    @Get(":id")
    async getOneUnitLesson(@Res() res, @Param("id") id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID');
        }
        const result = await this.unitLessonService.findUnitLessonById(id)
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
    }
}