import { Test, TestingModule } from '@nestjs/testing';
import { JournalEntryService } from './journal-entry.service';
import { PrismaService } from 'src/prisma.service';
import {
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

describe('JournalEntryService', () => {
  let service: JournalEntryService;
  let prisma: PrismaService;

  const mockPrismaService = {
    emotionalJournal: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    journalEntry: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalEntryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<JournalEntryService>(JournalEntryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a journal entry with a new journal if needed', async () => {
      mockPrismaService.emotionalJournal.findFirst.mockResolvedValue(null);
      mockPrismaService.emotionalJournal.create.mockResolvedValue({
        id: 'journal-id',
      });
      mockPrismaService.journalEntry.create.mockResolvedValue({
        id: 'entry-id',
        date: new Date(),
        description: 'desc',
        updatedAt: new Date(),
        emotionId: 'emotion-id',
      });

      const result = await service.create({
        userId: 'user-id',

        description: 'desc',
        emotionId: 'emotion-id',
      });

      expect(result.data.id).toBe('entry-id');
      expect(result.message).toBe('Entrée de journal créée avec succès');
    });

    it('should throw error if prisma throws unknown error', async () => {
      mockPrismaService.emotionalJournal.findFirst.mockRejectedValue(
        new Error('DB Error'),
      );
      await expect(
        service.create({
          userId: 'user-id',
          description: 'desc',
          emotionId: 'emotion-id',
        }),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw BadRequestException for unique constraint error', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const error = new Error() as any;
      error.code = 'P2002';
      mockPrismaService.emotionalJournal.findFirst.mockRejectedValue(error);

      await expect(
        service.create({
          userId: 'user-id',
          description: 'desc',
          emotionId: 'emotion-id',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOneFromUserByJournal', () => {
    it('should return one journal entry', async () => {
      mockPrismaService.journalEntry.findFirst.mockResolvedValue({
        id: 'entry-id',
      });

      const result = await service.findOneFromUserByJournal(
        'user-id',
        'entry-id',
      );

      expect(result.data?.id).toBe('entry-id');
    });
  });

  describe('findOneFromUserByJournalByDate', () => {
    it('should return entry for given date', async () => {
      mockPrismaService.journalEntry.findFirst.mockResolvedValue({
        id: 'entry-id',
      });

      const result = await service.findOneFromUserByJournalByDate(
        'user-id',
        '2023-01-01',
      );

      expect(result.data?.id).toBe('entry-id');
    });
  });

  describe('findAllFromUserByJournal', () => {
    it('should return all entries for a journal', async () => {
      mockPrismaService.journalEntry.findMany.mockResolvedValue([
        { id: 'entry-id' },
      ]);

      const result = await service.findAllFromUserByJournal(
        'user-id',
        'journal-id',
      );

      expect(result.data.length).toBe(1);
    });
  });

  describe('updateFromUser', () => {
    it('should update an existing journal entry', async () => {
      mockPrismaService.journalEntry.findFirst.mockResolvedValue({
        id: 'entry-id',
      });
      mockPrismaService.journalEntry.update.mockResolvedValue({
        id: 'entry-id',
      });

      const result = await service.updateFromUser('entry-id', {
        userId: 'user-id',
        description: 'updated',
        emotionId: 'emotion-id',
      });

      expect(result.data.id).toBe('entry-id');
    });

    it('should throw NotFoundException if entry does not exist', async () => {
      mockPrismaService.journalEntry.findFirst.mockResolvedValue(null);

      await expect(
        service.updateFromUser('entry-id', {
          userId: 'user-id',
          description: 'updated',
          emotionId: 'emotion-id',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFromUser', () => {
    it('should delete an entry if found', async () => {
      mockPrismaService.journalEntry.findFirst.mockResolvedValue({
        id: 'entry-id',
      });
      mockPrismaService.journalEntry.delete.mockResolvedValue({});

      const result = await service.removeFromUser('user-id', 'entry-id');

      expect(result.message).toBe('Entrée de journal supprimée avec succès');
    });

    it('should throw NotFoundException if entry is not found', async () => {
      mockPrismaService.journalEntry.findFirst.mockResolvedValue(null);

      await expect(
        service.removeFromUser('user-id', 'entry-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
