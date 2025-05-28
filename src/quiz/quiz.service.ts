import { Injectable } from '@nestjs/common';
import { QuizRepository } from './quiz.repository';
import { CreateQuizDto, UpdateQuizDto } from './dto/create-quiz.dto';
import { AuthService } from '../auth/auth.service';
import { SubmitQuizDto } from './dto/submit-quiz.dto';

@Injectable()
export class QuizService {
    constructor(
        private readonly quizRepository: QuizRepository,
        private readonly authService: AuthService
    ) { }

    async findQuizById(id: string) {
        return this.quizRepository.findQuizByIdOrThrow(id);
    }

    async findQuizBySlug(slug: string) {
        return this.quizRepository.findQuizBySlugOrThrow(slug);
    }

    async findAllQuizs() {
        return this.quizRepository.findAllQuizs();
    }

    async createQuiz(dto: CreateQuizDto) {
        return this.quizRepository.createQuiz(dto);
    }

    async updateQuiz(id: string, dto: UpdateQuizDto) {
        return this.quizRepository.updateQuiz(id, dto);
    }

    async deleteQuiz(id: string) {
        return this.quizRepository.deleteQuiz(id);
    }

    async checkAnswer(token: string, dto: SubmitQuizDto) {
        // decode token
        const { sub } = await this.authService.decodeJwtToken(token);
        return this.quizRepository.checkAnswer(sub, dto);
    }

    async getHistory(token: string, slugQuiz: string) {
        // decode token
        const { sub } = await this.authService.decodeJwtToken(token);
        return this.quizRepository.getHistory(sub, slugQuiz);
    }
}