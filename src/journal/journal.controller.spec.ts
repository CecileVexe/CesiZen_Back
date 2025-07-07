/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { CreateJournalDto } from './dto/create-journal.dto';

describe('JournalController', () => {
  let controller: JournalController;
  let service: JournalService;

  const mockJournalService = {
    create: jest.fn(),
    findUserJournal: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JournalController],
      providers: [{ provide: JournalService, useValue: mockJournalService }],
    }).compile();

    controller = module.get<JournalController>(JournalController);
    service = module.get<JournalService>(JournalService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should call journalService.create with the provided DTO', async () => {
      const dto: CreateJournalDto = { userId: 'user123' };
      const mockResponse = { id: 'journal-id', ...dto };

      mockJournalService.create.mockResolvedValue(mockResponse);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('findOne', () => {
    it('should call journalService.findUserJournal with correct params', async () => {
      const userId = 'user123';
      const period = 'month';
      const targetDate = '2025-05-01';
      const mockResult = { data: [], message: 'OK' };

      mockJournalService.findUserJournal.mockResolvedValue(mockResult);

      const result = await controller.findOne(userId, period, targetDate);

      expect(service.findUserJournal).toHaveBeenCalledWith(
        userId,
        period,
        targetDate,
      );
      expect(result).toEqual(mockResult);
    });

    it('should use default period "week" if not provided', async () => {
      const userId = 'user123';
      const targetDate = '2025-05-01';
      const mockResult = { data: [], message: 'OK' };

      mockJournalService.findUserJournal.mockResolvedValue(mockResult);

      const result = await controller.findOne(userId, undefined, targetDate);

      expect(service.findUserJournal).toHaveBeenCalledWith(
        userId,
        'week',
        targetDate,
      );
    });
  });

  describe('remove', () => {
    it('should call journalService.remove with the correct userId', async () => {
      const userId = 'user123';
      const mockResponse = { message: 'Journal supprimé' };

      mockJournalService.remove.mockResolvedValue(mockResponse);

      const result = await controller.remove(userId);

      expect(service.remove).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockResponse);
    });
  });
});
