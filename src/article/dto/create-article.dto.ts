import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  readingTime: number;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
