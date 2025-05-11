// emotion.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { EmotionService } from './emotion.service';
import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('EmotionService', () => {
  let service: EmotionService;
  let prisma: PrismaService;

  const mockPrisma = {
    emotion: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmotionService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<EmotionService>(EmotionService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and return an emotion', async () => {
      const dto = {
        name: 'Joie',
        color: '#FFFF00',
        emotionCategoryId: 'cat1',
      };
      const result = {
        id: 'id1',
        name: 'Joie',
        color: '#FFFF00',
        emotionCategoryId: 'cat1',
        emotionCategory: {
          name: 'Positive',
          smiley: '😊',
          color: '#FFF',
          id: 'cat1',
        },
      };
      mockPrisma.emotion.create.mockResolvedValue(result);

      expect(await service.create(dto)).toEqual({
        data: result,
        message: 'Emotion créé avec succès',
      });
    });

    it('should throw BadRequestException on duplicate error', async () => {
      mockPrisma.emotion.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.create({} as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all emotions', async () => {
      const emotions = [{ id: 'e1' }];
      mockPrisma.emotion.findMany.mockResolvedValue(emotions);
      mockPrisma.emotion.count.mockResolvedValue(1);

      const result = await service.findAll();

      expect(result).toEqual({
        data: emotions,
        total: 1,
        message: 'Emotions récupérés avec succès',
      });
    });

    it('should throw NotFoundException if no emotions found', async () => {
      mockPrisma.emotion.findMany.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a single emotion', async () => {
      const emotion = { id: 'e1' };
      mockPrisma.emotion.findUnique.mockResolvedValue(emotion);

      expect(await service.findOne('e1')).toEqual({
        data: emotion,
        message: 'Emotion récupérée avec succès',
      });
    });

    it('should throw NotFoundException if emotion not found', async () => {
      mockPrisma.emotion.findUnique.mockResolvedValue(null);

      await expect(service.findOne('e1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return emotion', async () => {
      const emotion = { id: 'e1' };
      mockPrisma.emotion.update.mockResolvedValue(emotion);

      expect(await service.update('e1', {} as any)).toEqual({
        data: emotion,
        message: 'Emotion mis à jour avec succès',
      });
    });

    it('should throw BadRequestException on duplicate error', async () => {
      mockPrisma.emotion.update.mockRejectedValue({ code: 'P2002' });

      await expect(service.update('e1', {} as any)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should remove emotion if exists', async () => {
      mockPrisma.emotion.findUnique.mockResolvedValue({ id: 'e1' });
      mockPrisma.emotion.delete.mockResolvedValue({});

      expect(await service.remove('e1')).toEqual({
        message: 'Emotion supprimée avec succès',
      });
    });

    it('should throw NotFoundException if emotion does not exist', async () => {
      mockPrisma.emotion.findUnique.mockResolvedValue(null);

      await expect(service.remove('e1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException on delete constraint error', async () => {
      mockPrisma.emotion.findUnique.mockResolvedValue({ id: 'e1' });
      mockPrisma.emotion.delete.mockRejectedValue({ code: 'P2003' });

      await expect(service.remove('e1')).rejects.toThrow(ForbiddenException);
    });
  });
});
