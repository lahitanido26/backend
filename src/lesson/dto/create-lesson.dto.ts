import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
export class CreateLessonDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsInt()
    number: number;
}

export class UpdateLessonDto extends PartialType(CreateLessonDto) { }