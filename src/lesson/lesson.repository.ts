import { BadRequestException, Injectable } from '@nestjs/common';
import { LessonQuery } from '../prisma/queries/lesson/lesson.query';
import { CreateLessonDto, UpdateLessonDto } from './dto/create-lesson.dto';
import { generateSlug } from '../helpers/helper';

@Injectable()
export class LessonRepository {
    constructor(
        private readonly lessonQuery: LessonQuery
    ) { }

    async findLessonByIdOrThrow(id: string) {
        const lesson = await this.lessonQuery.findById(id);
        if (!lesson) {
            throw new BadRequestException('Lesson not found');
        }
        return lesson;
    }

    async findLessonBySlugOrThrow(slug: string) {
        const lesson = await this.lessonQuery.findBySlug(slug);
        if (!lesson) {
            throw new BadRequestException('Lesson not found');
        }
        return lesson;
    }

    async checkSlugExistAndThrow(slug: string) {
        const lesson = await this.lessonQuery.findBySlug(slug);
        if (lesson) {
            throw new BadRequestException('Slug already exist');
        }
        return
    }

    async findAllLessons() {
        return await this.lessonQuery.findAll();
    }

    async createLesson(dto: CreateLessonDto) {
        const slug = generateSlug(dto.title);
        await this.checkSlugExistAndThrow(slug);
        return await this.lessonQuery.create({
            title: dto.title,
            number: dto.number,
            slug: slug
        })
    }

    async updateLesson(id: string, dto: UpdateLessonDto) {
        const lesson = await this.findLessonByIdOrThrow(id);
        const slug = dto.title ? generateSlug(dto.title) : undefined;
        if (slug && slug !== lesson.slug) {
            await this.checkSlugExistAndThrow(slug);
        }
        return await this.lessonQuery.updateById(id, {
            title: dto.title,
            slug: slug,
            number: dto.number
        })
    }

    async deleteLesson(id: string) {
        const lesson = await this.findLessonByIdOrThrow(id);
        return await this.lessonQuery.deleteById(lesson.id);
    }
}