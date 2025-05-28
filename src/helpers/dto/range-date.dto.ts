import { IsDateString, IsOptional } from 'class-validator';

export class RangeDateDto {
    @IsOptional()
    @IsDateString()
    startDate: string;

    @IsOptional()
    @IsDateString()
    endDate: string;
}