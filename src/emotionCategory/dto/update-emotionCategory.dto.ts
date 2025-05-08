import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateEmotionCategoryDto } from './create-emotionCategory.dto';

export class UpdateEmotionCategoryDto extends PartialType(
  CreateEmotionCategoryDto,
) {
  @IsNotEmpty()
  @IsOptional()
  name: string;
  @IsNotEmpty()
  @IsOptional()
  color: string;
  @IsNotEmpty()
  @IsOptional()
  smiley: string;
}
