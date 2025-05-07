import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateJournalEntryDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  emotionId: string;
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
