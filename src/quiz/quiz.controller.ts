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
import { QuizService } from './quiz.service';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { Roles } from '../auth/decorator';
import { TypeRoleAdmin, TypeRoleUser } from '@prisma/client';
import { CreateQuizDto, UpdateQuizDto } from './dto/create-quiz.dto';
import { isValidObjectId } from '../helpers/helper';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Controller('quiz')
export class QuizController {
    constructor(
        private readonly quizService: QuizService,
        private readonly httpHelper: HttpHelper,
    ) { }

    @Post("check-answer")
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleUser.USER)
    async checkAnswer(
        @Headers("authorization") authorization: string,
        @Body() dto: SubmitQuizDto,
        @Res() res) {
        const result = await this.quizService.checkAnswer(authorization, dto)
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
    }

    @Post()
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleAdmin.ADMIN, TypeRoleAdmin.SUPER_ADMIN)
    async createQuiz(@Body() dto: CreateQuizDto, @Res() res) {
        const result = await this.quizService.createQuiz(dto)
        return this.httpHelper.formatResponse(res, HttpStatus.CREATED, result)
    }

    @Put(":id")
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleAdmin.ADMIN, TypeRoleAdmin.SUPER_ADMIN)
    async updateQuiz(@Body() dto: UpdateQuizDto, @Res() res, @Param("id") id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID');
        }
        await this.quizService.updateQuiz(id, dto);
        return this.httpHelper.formatResponse(res, HttpStatus.OK, {})
    }

    @Delete(":id")
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleAdmin.ADMIN, TypeRoleAdmin.SUPER_ADMIN)
    async deleteQuiz(@Res() res, @Param("id") id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID');
        }
        await this.quizService.deleteQuiz(id);
        return this.httpHelper.formatResponse(res, HttpStatus.OK, {})
    }

    @Get()
    async getAllQuiz(@Res() res) {
        const result = await this.quizService.findAllQuizs()
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
    }

    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleUser.USER)
    @Get("score/:slug")
    async getScore(
        @Res() res,
        @Param("slug") slug: string,
        @Headers("authorization") authorization: string,
    ) {
        const result = await this.quizService.getHistory(authorization, slug)
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
    }

    @Get("slug/:slug")
    async getOneQuizBySlug(@Res() res, @Param("slug") slug: string) {
        const result = await this.quizService.findQuizBySlug(slug)
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
    }

    @Get(":id")
    async getOneQuiz(@Res() res, @Param("id") id: string) {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('Invalid ID');
        }
        const result = await this.quizService.findQuizById(id)
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
    }
}