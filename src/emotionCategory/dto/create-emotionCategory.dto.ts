import { IsNotEmpty } from 'class-validator';

export class CreateEmotionCategoryDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  color: string;
}
