import { IsInt, IsNotEmpty, IsString } from 'class-validator';
export class SubmitQuizDto {
    @IsNotEmpty()
    @IsString()
    slugQuiz: string;

    @IsNotEmpty()
    @IsInt()
    numberQuiz: number;

    @IsNotEmpty()
    @IsString()
    answer: string;
}

