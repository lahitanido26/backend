import { Injectable } from '@nestjs/common';
import { LessonRepository } from './lesson.repository';
import { CreateLessonDto, UpdateLessonDto } from './dto/create-lesson.dto';

@Injectable()
export class LessonService {
    constructor(
        private readonly lessonRepository: LessonRepository
    ) { }

    async findLessonById(id: string) {
        return this.lessonRepository.findLessonByIdOrThrow(id);
    }

    async findLessonBySlug(slug: string) {
        return this.lessonRepository.findLessonBySlugOrThrow(slug);
    }

    async findAllLessons() {
        return this.lessonRepository.findAllLessons();
    }

    async createLesson(dto: CreateLessonDto) {
        return this.lessonRepository.createLesson(dto);
    }

    async updateLesson(id: string, dto: UpdateLessonDto) {
        return this.lessonRepository.updateLesson(id, dto);
    }

    async deleteLesson(id: string) {
        return this.lessonRepository.deleteLesson(id);
    }
}