import { BadRequestException, Injectable } from '@nestjs/common';
import { UnitLessonQuery } from '../prisma/queries/unit-lesson/unit-lesson.query';
import { generateSlug } from '../helpers/helper';
import { CreateUnitLessonDto, UpdateUnitLessonDto } from './dto/create-unit-lesson.dto';
import { Prisma } from '@prisma/client';
import { LessonRepository } from '../lesson/lesson.repository';

@Injectable()
export class UnitLessonRepository {
    constructor(
        private readonly unitLessonQuery: UnitLessonQuery,
        private readonly lessonRepository: LessonRepository
    ) { }

    async findUnitLessonByIdOrThrow(id: string) {
        const unitLesson = await this.unitLessonQuery.findById(id);
        if (!unitLesson) {
            throw new BadRequestException('Unit Lesson not found');
        }
        return unitLesson;
    }

    async findUnitLessonBySlugOrThrow(slug: string) {
        const unitLesson = await this.unitLessonQuery.findBySlug(slug);
        if (!unitLesson) {
            throw new BadRequestException('Unit Lesson not found');
        }
        return unitLesson;
    }

    async checkSlugExistAndThrow(slug: string) {
        const unitLesson = await this.unitLessonQuery.findBySlug(slug);
        if (unitLesson) {
            throw new BadRequestException('Slug already exist');
        }
        return
    }

    async findAllUnitLessons() {
        return await this.unitLessonQuery.findAll();
    }

    async createUnitLesson(dto: CreateUnitLessonDto) {
        const slug = generateSlug(dto.title);
        await this.checkSlugExistAndThrow(slug);
        const lesson = await this.lessonRepository.findLessonBySlugOrThrow(dto.slugLesson);
        return await this.unitLessonQuery.create({
            lesson: {
                connect: {
                    id: lesson.id
                }
            },
            title: dto.title,
            slug: slug,
            content: JSON.parse(JSON.stringify(dto.content)) as Prisma.JsonArray
        })
    }

    async updateUnitLesson(id: string, dto: UpdateUnitLessonDto) {
        const unitLesson = await this.findUnitLessonByIdOrThrow(id);
        const slug = dto.title ? generateSlug(dto.title) : undefined;
        if (slug && slug !== unitLesson.slug) {
            await this.checkSlugExistAndThrow(slug);
        }
        if (dto.slugLesson) {
            var lesson = await this.lessonRepository.findLessonBySlugOrThrow(dto.slugLesson);
        }
        return await this.unitLessonQuery.updateById(id, {
            title: dto.title,
            slug: slug,
            content: dto.content ? JSON.parse(JSON.stringify(dto.content)) as Prisma.JsonArray : undefined,
            ...(lesson ? { lesson: { connect: { id: lesson.id } } } : {})
        })
    }

    async deleteUnitLesson(id: string) {
        const unitLesson = await this.findUnitLessonByIdOrThrow(id);
        return await this.unitLessonQuery.deleteById(unitLesson.id);
    }
}