import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateArticleDto {
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsNotEmpty()
  categoryId?: string;

  @IsOptional()
  bannerId?: string;
}
