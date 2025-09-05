/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { JournalService } from './journal.service';
import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateJournalDto } from './dto/create-journal.dto';
import { subDays } from 'date-fns';

describe('JournalService', () => {
  let service: JournalService;
  let prisma: PrismaService;

  const mockPrisma = {
    emotionalJournal: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JournalService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<JournalService>(JournalService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create a journal entry and return success message', async () => {
      const dto: CreateJournalDto = { userId: 'user1' };
      const created = {
        id: 'journal1',
        userId: 'user1',
        updatedAt: new Date(),
        entries: [],
      };

      mockPrisma.emotionalJournal.create.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(prisma.emotionalJournal.create).toHaveBeenCalledWith({
        data: dto,
        select: {
          id: true,
          userId: true,
          updatedAt: true,
          entries: {
            select: {
              id: true,
              date: true,
              emotionId: true,
            },
          },
        },
      });

      expect(result).toEqual({
        data: created,
        message: 'Entrée de journal créé avec succès',
      });
    });

    it('should throw BadRequestException on duplicate data (P2002)', async () => {
      const dto = { userId: 'user1' };
      const error = { code: 'P2002' };
      mockPrisma.emotionalJournal.create.mockRejectedValue(error);

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      const dto = { userId: 'user1' };
      mockPrisma.emotionalJournal.create.mockRejectedValue(
        new Error('Unknown'),
      );

      await expect(service.create(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findUserJournal', () => {
    it('should return filtered journal data for the given period and date', async () => {
      const userId = 'user1';
      const targetDate = new Date().toISOString();
      const mockEntry = {
        id: 'journal1',
        userId,
        updatedAt: new Date(),
        entries: [],
      };

      mockPrisma.emotionalJournal.findFirst.mockResolvedValue(mockEntry);

      const result = await service.findUserJournal(userId, 'week', targetDate);

      expect(prisma.emotionalJournal.findFirst).toHaveBeenCalled();
      expect(result).toEqual({
        data: mockEntry,
        message: 'Entrée de journal créé avec succès',
      });
    });

    it('should use current date if no targetDate provided', async () => {
      const userId = 'user1';
      const mockEntry = {
        id: 'journal1',
        userId,
        updatedAt: new Date(),
        entries: [],
      };

      mockPrisma.emotionalJournal.findFirst.mockResolvedValue(mockEntry);

      const result = await service.findUserJournal(userId, 'month');

      expect(result).toEqual({
        data: mockEntry,
        message: 'Entrée de journal créé avec succès',
      });
    });
  });

  describe('remove', () => {
    it('should return success message if journal exists', async () => {
      const userId = 'user1';
      const journal = { id: 'journal1', userId };
      mockPrisma.emotionalJournal.findFirst.mockResolvedValue(journal);

      const result = await service.remove(userId);

      expect(prisma.emotionalJournal.findFirst).toHaveBeenCalledWith({
        where: { userId },
      });

      expect(result).toEqual({
        message: 'Journal supprimé avec succès',
      });
    });

    it('should throw NotFoundException if journal not found', async () => {
      mockPrisma.emotionalJournal.findFirst.mockResolvedValue(null);

      await expect(service.remove('user2')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on error', async () => {
      mockPrisma.emotionalJournal.findFirst.mockRejectedValue(
        new Error('DB failure'),
      );

      await expect(service.remove('user2')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
