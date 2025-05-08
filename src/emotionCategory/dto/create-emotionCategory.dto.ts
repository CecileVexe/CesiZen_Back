import { IsNotEmpty } from 'class-validator';

export class CreateEmotionCategoryDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  color: string;
  @IsNotEmpty()
  smiley: string;
}
