import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty, IsNumber, IsString, IsUrl, ValidateNested } from 'class-validator';
import { IsObjectId } from '../../helpers/decorator/isValidObjectId.decorator';
export class CreateQuizDto {
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

    @IsArray()
    @ArrayNotEmpty()
    choices: string[]

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

export class UpdateQuizDto extends PartialType(CreateQuizDto) { }