import { PartialType } from '@nestjs/mapped-types';
import { CreateJournalEntryDto } from './create-journal-entry.dto';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateJournalEntryDto extends PartialType(CreateJournalEntryDto) {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  @IsOptional()
  emotionId: string;
}
