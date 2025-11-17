/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsIn,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsString()
  @IsIn(['food', 'transport', 'entertainment', 'utilities', 'other'])
  category?: 'food' | 'transport' | 'entertainment' | 'utilities' | 'other';

  @IsOptional()
  @IsString()
  @IsIn(['income', 'expense'])
  type?: 'income' | 'expense';

  @IsOptional()
  @IsDateString()
  date?: Date;
}
