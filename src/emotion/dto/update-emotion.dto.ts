import { PartialType } from '@nestjs/mapped-types';
import { CreateEmotionDto } from './create-emotion.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateEmotionDto extends PartialType(CreateEmotionDto) {
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsOptional()
  color: string;

  @IsNotEmpty()
  @IsOptional()
  emotionCategoryId: string;
}
