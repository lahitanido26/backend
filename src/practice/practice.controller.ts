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
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { HttpHelper } from '../helpers/http-helper';
import { PracticeService } from './practice.service';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { Roles } from '../auth/decorator';
import { TypeRoleAdmin, TypeRoleUser } from '@prisma/client';
import { CreatePracticeDto, UpdatePracticeDto } from './dto/create-practice';
import { isValidObjectId } from '../helpers/helper';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePredictPracticeDto } from './dto/predict.dto';

@Controller('practice')
export class PracticeController {
    constructor(
        private readonly practiceService: PracticeService,
        private readonly httpHelper: HttpHelper,
    ) { }

    @Post()
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleAdmin.ADMIN, TypeRoleAdmin.SUPER_ADMIN)
    async createPractice(@Body() dto: CreatePracticeDto, @Res() res) {
        const result = await this.practiceService.createPractice(dto)
        return this.httpHelper.formatResponse(res, HttpStatus.CREATED, result)
    }

    @Post("scan")
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleUser.USER)
    @UseInterceptors(FileInterceptor('file'))
    async predictPractice(
        @Headers("authorization") authorization: string,
        @Body() dto: CreatePredictPracticeDto,
        @Res() res,
        @UploadedFile() file: Express.Multer.File) {
        const result = await this.practiceService.predictPractice(authorization, dto, file);
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result);
    }

    @Put(":id")
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleAdmin.ADMIN, TypeRoleAdmin.SUPER_ADMIN)
    async updatePractice(@Body() dto: UpdatePracticeDto, @Res() res, @Param("id") id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID');
        }
        await this.practiceService.updatePractice(id, dto);
        return this.httpHelper.formatResponse(res, HttpStatus.OK, {})
    }

    @Delete(":id")
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleAdmin.ADMIN, TypeRoleAdmin.SUPER_ADMIN)
    async deletePractice(@Res() res, @Param("id") id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID');
        }
        await this.practiceService.deletePractice(id);
        return this.httpHelper.formatResponse(res, HttpStatus.OK, {})
    }

    @Get()
    async getAllPractice(@Res() res) {
        const result = await this.practiceService.findAllPractices()
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
    }

    @Get("slug/:slug")
    async getOnePracticeBySlug(@Res() res, @Param("slug") slug: string) {
        const result = await this.practiceService.findPracticeBySlug(slug)
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
    }

    @Get(":id")
    async getOnePractice(@Res() res, @Param("id") id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID');
        }
        const result = await this.practiceService.findPracticeById(id)
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
    }
}