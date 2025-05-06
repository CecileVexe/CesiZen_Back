import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

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

  @IsNumber()
  @IsNotEmpty()
  readingTime: number;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
