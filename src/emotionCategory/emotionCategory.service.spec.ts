import { Test, TestingModule } from '@nestjs/testing';
import { EmotionCategoryService } from './emotionCategory.service';
import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEmotionCategoryDto } from './dto/create-emotionCategory.dto';
import { UpdateEmotionCategoryDto } from './dto/update-emotionCategory.dto';

describe('EmotionCategoryService', () => {
  let service: EmotionCategoryService;
  let prisma: PrismaService;

  const mockPrismaService = {
    emotionCategory: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCategory = {
    id: '1',
    name: 'Joie',
    color: '#FFD700',
    smiley: '😊',
  };

  const createDto: CreateEmotionCategoryDto = {
    name: 'Joie',
    color: '#FFD700',
    smiley: '😊',
  };

  const updateDto: UpdateEmotionCategoryDto = {
    name: 'Tristesse',
    color: '#0000FF',
    smiley: '😢',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmotionCategoryService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EmotionCategoryService>(EmotionCategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a new category', async () => {
      mockPrismaService.emotionCategory.create.mockResolvedValue(
        mockCategory as any,
      );

      const result = await service.create(createDto);
      expect(result).toEqual({
        data: mockCategory,
        message: 'Catégorie créé avec succès',
      });
    });

    it('should throw BadRequestException for duplicate', async () => {
      mockPrismaService.emotionCategory.create.mockRejectedValue({
        code: 'P2002',
      });

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of categories', async () => {
      mockPrismaService.emotionCategory.findMany.mockResolvedValue([
        mockCategory,
      ] as any);
      mockPrismaService.emotionCategory.count.mockResolvedValue(1);

      const result = await service.findAll();
      expect(result).toEqual({
        data: [mockCategory],
        total: 1,
        message: 'Catégories récupérés avec succès',
      });
    });

    it('should throw NotFoundException if no categories found', async () => {
      mockPrismaService.emotionCategory.findMany.mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a single category', async () => {
      mockPrismaService.emotionCategory.findUnique.mockResolvedValue(
        mockCategory as any,
      );

      const result = await service.findOne('1');
      expect(result).toEqual({
        data: mockCategory,
        message: 'Catégorie récupéré avec succès',
      });
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.emotionCategory.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the category', async () => {
      mockPrismaService.emotionCategory.update.mockResolvedValue({
        ...mockCategory,
        ...updateDto,
      } as any);

      const result = await service.update('1', updateDto);
      expect(result).toEqual({
        data: {
          ...mockCategory,
          ...updateDto,
        },
        message: 'Catégorie mis à jour avec succès',
      });
    });

    it('should throw NotFoundException if update fails', async () => {
      mockPrismaService.emotionCategory.update.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(service.update('1', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for duplicate constraint', async () => {
      mockPrismaService.emotionCategory.update.mockRejectedValue({
        code: 'P2002',
      });

      await expect(service.update('1', updateDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      mockPrismaService.emotionCategory.findUnique.mockResolvedValue(
        mockCategory as any,
      );
      mockPrismaService.emotionCategory.delete.mockResolvedValue({});

      const result = await service.remove('1');
      expect(result).toEqual({ message: 'Catégorie supprimé avec succès' });
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.emotionCategory.findUnique.mockResolvedValue(null);
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if deletion is blocked by constraint', async () => {
      mockPrismaService.emotionCategory.findUnique.mockResolvedValue(
        mockCategory as any,
      );
      mockPrismaService.emotionCategory.delete.mockRejectedValue({
        code: 'P2003',
      });

      await expect(service.remove('1')).rejects.toThrow(ForbiddenException);
    });
  });
});
