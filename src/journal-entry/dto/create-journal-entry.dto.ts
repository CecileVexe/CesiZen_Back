import { IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateJournalEntryDto {
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  @IsDateString()
  date: string;
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  emotionId: string;
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  journalId: string;
}
