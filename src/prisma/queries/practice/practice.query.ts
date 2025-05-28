import { Injectable } from '@nestjs/common';
import { DbService } from '../../db.service';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PracticeQuery extends DbService {
    async findAll() {
        return await this.prisma.practice.findMany({
            include: {
                lesson: true
            }
        });
    }

    async findById(id: string) {
        return await this.prisma.practice.findUnique({
            where: {
                id
            },
            include: {
                lesson: true
            }
        })
    }

    async findBySlug(slug: string) {
        return await this.prisma.practice.findUnique({
            where: {
                slug
            },
            include: {
                lesson: true
            }
        })
    }

    async create(dto: Prisma.PracticeCreateInput) {
        return await this.prisma.practice.create({
            data: dto
        })
    }

    async updateById(id: string, dto: Prisma.PracticeUpdateInput) {
        return await this.prisma.practice.update({
            where: {
                id
            },
            data: dto
        })
    }

    async deleteById(id: string) {
        return await this.prisma.practice.delete({
            where: {
                id
            }
        })
    }
}