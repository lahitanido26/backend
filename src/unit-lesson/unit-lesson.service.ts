import { Injectable } from '@nestjs/common';
import { UnitLessonRepository } from './unit-lesson.repository';
import { CreateUnitLessonDto, UpdateUnitLessonDto } from './dto/create-unit-lesson.dto';

@Injectable()
export class UnitLessonService {
    constructor(
        private readonly unitUnitLessonRepository: UnitLessonRepository
    ) { }

    async findUnitLessonById(id: string) {
        return this.unitUnitLessonRepository.findUnitLessonByIdOrThrow(id);
    }

    async findUnitLessonBySlug(slug: string) {
        return this.unitUnitLessonRepository.findUnitLessonBySlugOrThrow(slug);
    }

    async findAllUnitLessons() {
        return this.unitUnitLessonRepository.findAllUnitLessons();
    }

    async createUnitLesson(dto: CreateUnitLessonDto) {
        return this.unitUnitLessonRepository.createUnitLesson(dto);
    }

    async updateUnitLesson(id: string, dto: UpdateUnitLessonDto) {
        return this.unitUnitLessonRepository.updateUnitLesson(id, dto);
    }

    async deleteUnitLesson(id: string) {
        return this.unitUnitLessonRepository.deleteUnitLesson(id);
    }
}