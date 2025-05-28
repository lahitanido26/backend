import { Injectable } from '@nestjs/common';
import { DbService } from '../../db.service';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class LessonQuery extends DbService {

    async findAll() {
        return await this.prisma.lesson.findMany({
            include: {
                units: true
            }
        });
    }

    async findById(id: string) {
        return await this.prisma.lesson.findUnique({
            where: {
                id
            }
        })
    }

    async findBySlug(slug: string) {
        return await this.prisma.lesson.findUnique({
            where: {
                slug
            }
        })
    }

    async create(dto: Prisma.LessonCreateInput) {
        return await this.prisma.lesson.create({
            data: dto
        })
    }

    async updateById(id: string, dto: Prisma.LessonUpdateInput) {
        return await this.prisma.lesson.update({
            where: {
                id
            },
            data: dto
        })
    }

    async deleteById(id: string) {
        return await this.prisma.lesson.delete({
            where: {
                id
            }
        })
    }
}