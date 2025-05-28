import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsString, IsUrl, ValidateNested } from 'class-validator';
export class CreatePracticeDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    slugLesson: string;

    @Type(() => Questions)
    @ValidateNested()
    @IsArray()
    @IsNotEmpty()
    questions: Questions[];

    @Type(() => Signs)
    @ValidateNested()
    @IsArray()
    @IsNotEmpty()
    signs: Signs[];
}

class Questions {
    @IsNotEmpty()
    @IsInt()
    number: number;

    @IsNotEmpty()
    @IsUrl()
    imageUrl: string;

    @IsNotEmpty()
    @IsString()
    question: string;

    @IsNotEmpty()
    @IsString()
    answer: string;

    @IsNotEmpty()
    @IsNumber()
    point: number;
}

class Signs {
    @IsNotEmpty()
    @IsUrl()
    imageUrl: string;

    @IsNotEmpty()
    @IsString()
    label: string;

    @IsNotEmpty()
    @IsString()
    description: string;
}

export class UpdatePracticeDto extends PartialType(CreatePracticeDto) { }