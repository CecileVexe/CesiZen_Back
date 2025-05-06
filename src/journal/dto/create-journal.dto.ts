import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateJournalDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
