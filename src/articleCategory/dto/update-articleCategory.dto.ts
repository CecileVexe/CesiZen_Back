import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateArticleCategoryDto } from './create-articleCategory.dto';

export class UpdateArticleCategoryDto extends PartialType(
  CreateArticleCategoryDto,
) {
  @IsNotEmpty()
  @IsOptional()
  name: string;
  @IsNotEmpty()
  @IsOptional()
  description: string;
}
