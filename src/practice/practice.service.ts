import { Injectable } from '@nestjs/common';
import { PracticeRepository } from './practice.repository';
import { CreatePracticeDto, UpdatePracticeDto } from './dto/create-practice';
import { CreatePredictPracticeDto } from './dto/predict.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class PracticeService {
    constructor(
        private readonly practiceRepository: PracticeRepository,
        private readonly authService: AuthService
    ) { }

    async findPracticeById(id: string) {
        return this.practiceRepository.findPracticeByIdOrThrow(id);
    }

    async findPracticeBySlug(slug: string) {
        return this.practiceRepository.findPracticeBySlugOrThrow(slug);
    }

    async findAllPractices() {
        return this.practiceRepository.findAllPractices();
    }

    async createPractice(dto: CreatePracticeDto) {
        return this.practiceRepository.createPractice(dto);
    }

    async updatePractice(id: string, dto: UpdatePracticeDto) {
        return this.practiceRepository.updatePractice(id, dto);
    }

    async deletePractice(id: string) {
        return this.practiceRepository.deletePractice(id);
    }

    async predictPractice(token: string, dto: CreatePredictPracticeDto, file: Express.Multer.File) {
        // decode token
        const { sub } = await this.authService.decodeJwtToken(token);
        return this.practiceRepository.CaptureImage(sub, dto, file);
    }
}