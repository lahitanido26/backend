import { BadRequestException, Injectable } from '@nestjs/common';
import { UserQuery } from '../prisma/queries/user/user.query';
import {
  FolderBucketType,
  _validateFile,
  getCustomFilename,
} from '../helpers/helper';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { GatewayService } from '../gateway/gateway.service';
import UpdateProfileDto from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserRepository {
  constructor(
    private readonly userQuery: UserQuery,
    private readonly gatewayService: GatewayService,
    private readonly prisma: PrismaService,
  ) {}

  async findUserByIdOrThrow(id: string) {
    const user = await this.userQuery.findById(id);
    if (!user) throw new BadRequestException('User tidak ditemukan');
    return user;
  }
  async findUserByUsernameOrEmailOrThrow(usernameOrEmail: string) {
    const user = await this.userQuery.findByEmailOrUsername(usernameOrEmail);
    if (!user) {
      throw new BadRequestException('User belum terdaftar');
    }
    return user;
  }

  async checkUserExist(username: string, email: string) {
    const user = await this.userQuery.findByEmailOrUsername(username);
    if (user) {
      throw new BadRequestException('User sudah terdaftar');
    }
    const userEmail = await this.userQuery.findByEmailOrUsername(email);
    if (userEmail) {
      throw new BadRequestException('Email sudah terdaftar');
    }
  }

  async updateProfile(idUser: string, dto: UpdateProfileDto) {
    const user = await this.findUserByIdOrThrow(idUser);
    if (dto.username && user.username !== dto.username) {
      const exists = await this.userQuery.findByEmailOrUsername(dto.username);
      if (exists) throw new BadRequestException('Username sudah terdaftar');
    }
    if (dto.email && user.email !== dto.email) {
      const exists = await this.userQuery.findByEmailOrUsername(dto.email);
      if (exists) throw new BadRequestException('Email sudah terdaftar');
    }

    if (dto.password) {
      // hashing password from body dto
      const salt = await bcrypt.genSalt();
      var hash = await bcrypt.hash(dto.password, salt);
      dto.password = hash;
    }
    const updateUser = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: dto.name,
        username: dto.username,
        email: dto.email,
        password: hash,
      },
    });
    return updateUser;
  }

  async findAllUser() {
    return await this.userQuery.findAllWithoutPassword();
  }
}
