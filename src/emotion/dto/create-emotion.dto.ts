import { IsNotEmpty } from 'class-validator';

export class CreateEmotionDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  color: string;

  @IsNotEmpty()
  emotionCategoryId: string;
}
