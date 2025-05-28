import { Injectable } from '@nestjs/common';
import { DbService } from '../../db.service';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class QuizQuery extends DbService {
    async findAll() {
        return await this.prisma.quiz.findMany({
            include: {
                lesson: true
            }
        });
    }

    async findById(id: string) {
        return await this.prisma.quiz.findUnique({
            where: {
                id
            }
        })
    }

    async findBySlug(slug: string) {
        return await this.prisma.quiz.findUnique({
            where: {
                slug
            }
        })
    }

    async create(dto: Prisma.QuizCreateInput) {
        return await this.prisma.quiz.create({
            data: dto
        })
    }

    async updateById(id: string, dto: Prisma.QuizUpdateInput) {
        return await this.prisma.quiz.update({
            where: {
                id
            },
            data: dto
        })
    }

    async deleteById(id: string) {
        return await this.prisma.quiz.delete({
            where: {
                id
            }
        })
    }
}