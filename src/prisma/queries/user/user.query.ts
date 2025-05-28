import { Injectable } from '@nestjs/common';
import { DbService } from '../../db.service';
import { RegisterUserDto } from '../../../auth/dto/register-user.dto';
import { Prisma, PrismaClient } from '@prisma/client';


@Injectable()
export class UserQuery extends DbService {
    async findById(id: string) {
        return await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async findByEmailOrUsername(emailOrUsername: string) {
        return await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername },
                    { username: emailOrUsername },
                ],
            },
        });
    }

    async findAllWithoutPassword() {
        return await this.prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                status: true,
                pointXp: true,
                profilePic: true
            },
        });
    }

    async register(payload: RegisterUserDto, prismaTx?: PrismaClient) {
        // expireAt 1 day
        const expireCodeVerify = new Date().getTime() + 1000 * 60 * 60 * 24
        // ngirim email verifikasi
        const min = 10000
        const max = 99999
        const codeVerify = Math.floor(Math.random() * (max - min + 1)) + min // Angka acak 5 digit
        const prisma = prismaTx || this.prisma;

        return await prisma.user.create({
            data: {
                username: payload.username,
                name: payload.name,
                email: payload.email,
                password: payload.password,
                codeVerify: codeVerify,
                expiresCodeVerifyAt: new Date(expireCodeVerify)
            }
        });
    }

    async update(id: string, payload: Prisma.UserUpdateInput, prismaTx?: PrismaClient) {
        const prisma = prismaTx || this.prisma;
        return await prisma.user.update({
            where: {
                id
            },
            data: payload
        })
    }

    async updateIsVerifiedEmail(id: string, isVerifiedEmail: boolean, prismaTx?: PrismaClient) {
        const prisma = prismaTx || this.prisma;
        return await prisma.user.update({
            where: {
                id
            },
            data: {
                isVerifiedEmail,
                expiresCodeVerifyAt: null,
                codeVerify: null
            }
        })
    }

    async changePassword(id: string, password: string, prismaTx?: PrismaClient) {
        const prisma = prismaTx || this.prisma;
        return await prisma.user.update({
            where: {
                id
            },
            data: {
                password
            }
        })
    }

    async registerAdmin(payload: Prisma.UserAdminCreateInput, prismaTx?: PrismaClient) {
        const prisma = prismaTx || this.prisma;
        return await prisma.userAdmin.create({
            data: payload
        })
    }

    async findAdminByEmailOrUsername(emailOrUsername: string) {
        return await this.prisma.userAdmin.findFirst({
            where: {
                OR: [
                    { email: emailOrUsername },
                    { username: emailOrUsername },
                ],
            },
        });
    }

    async findAdminById(id: string) {
        return await this.prisma.userAdmin.findUnique({
            where: {
                id
            }
        })
    }
}