import { Injectable } from '@nestjs/common';
import { DbService } from '../../db.service';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class UnitLessonQuery extends DbService {
    async findAll() {
        return await this.prisma.unitLesson.findMany();
    }

    async findById(id: string) {
        return await this.prisma.unitLesson.findUnique({
            where: {
                id
            }
        })
    }

    async findBySlug(slug: string) {
        return await this.prisma.unitLesson.findUnique({
            where: {
                slug
            }
        })
    }

    async create(dto: Prisma.UnitLessonCreateInput) {
        return await this.prisma.unitLesson.create({
            data: dto
        })
    }

    async updateById(id: string, dto: Prisma.UnitLessonUpdateInput) {
        return await this.prisma.unitLesson.update({
            where: {
                id
            },
            data: dto
        })
    }

    async deleteById(id: string) {
        return await this.prisma.unitLesson.delete({
            where: {
                id
            }
        })
    }
}