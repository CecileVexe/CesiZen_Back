import { Test, TestingModule } from '@nestjs/testing';
import { JournalEntryController } from './journal-entry.controller';
import { JournalEntryService } from './journal-entry.service';

describe('JournalEntryController', () => {
  let controller: JournalEntryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JournalEntryController],
      providers: [JournalEntryService],
    }).compile();

    controller = module.get<JournalEntryController>(JournalEntryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
