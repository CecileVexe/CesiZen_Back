import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  UserId: string;
}
