import {
    Body,
    Controller,
    Get,
    Put,
    HttpStatus,
    Param,
    Post,
    Res,
    Delete,
    Query,
    UseGuards,
    Headers,
} from '@nestjs/common';
import { HttpHelper } from '../helpers/http-helper';
import { JwtGuard, RoleGuard } from '../auth/guard';
import { TypeRoleUser } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../auth/decorator';
import UpdateProfileDto from './dto/update-user.dto';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly httpHelper: HttpHelper,
    ) { }

    @Put("profile")
    @UseGuards(JwtGuard, RoleGuard)
    @Roles(TypeRoleUser.USER)
    async updateProfile(
        @Headers("authorization") authorization: string,
        @Body() dto: UpdateProfileDto,
        @Res() res) {
        await this.userService.updateProfile(authorization, dto);
        return this.httpHelper.formatResponse(res, HttpStatus.OK, {});
    }

    @Get()
    async getAllUser(@Res() res) {
        const result = await this.userService.findAllUser();
        return this.httpHelper.formatResponse(res, HttpStatus.OK, result)
    }
}