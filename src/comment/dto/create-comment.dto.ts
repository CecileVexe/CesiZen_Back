import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  UserId: string;
  ArticleId: string;
}
