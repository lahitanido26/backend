import { IsInt, IsNotEmpty, IsString } from 'class-validator';
export class CreatePredictPracticeDto {
    @IsNotEmpty()
    @IsString()
    slugPractice: string;

    @IsNotEmpty()
    @IsInt()
    numberPractice: number;
}

