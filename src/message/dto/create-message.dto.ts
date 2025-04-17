import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  citizenId: string;
}
