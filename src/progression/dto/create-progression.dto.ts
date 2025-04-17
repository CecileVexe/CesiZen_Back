import { IsNotEmpty } from 'class-validator';

export class CreateProgressionDto {
  @IsNotEmpty()
  UserId: string;

  @IsNotEmpty()
  ArticleId: string;
}
