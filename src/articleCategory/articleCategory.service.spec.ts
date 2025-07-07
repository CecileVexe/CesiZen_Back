import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './articleCategory.service';
import { PrismaService } from 'src/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateArticleCategoryDto } from './dto/create-articleCategory.dto';
import { UpdateArticleCategoryDto } from './dto/update-articleCategory.dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let prisma: jest.Mocked<PrismaService>;

  const mockPrisma = {
    articleCategory: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    prisma = module.get(PrismaService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const dto: CreateArticleCategoryDto = {
        name: 'Bien-être',
        description: 'Description',
      };
      const result = { id: '1', ...dto };
      mockPrisma.articleCategory.create.mockResolvedValue(result);

      const response = await service.create(dto);
      expect(mockPrisma.articleCategory.create).toHaveBeenCalledWith({
        data: dto,
        select: { id: true, name: true, description: true },
      });
      expect(response).toEqual({
        data: result,
        message: 'Catégorie créé avec succès',
      });
    });

    it('should throw BadRequestException on duplicate', async () => {
      mockPrisma.articleCategory.create.mockRejectedValue({ code: 'P2002' });

      await expect(
        service.create({ name: '', description: '' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      mockPrisma.articleCategory.create.mockRejectedValue(new Error('fail'));

      await expect(
        service.create({ name: '', description: '' }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const data = [{ id: '1', name: 'A', description: 'B' }];
      mockPrisma.articleCategory.findMany.mockResolvedValue(data);
      mockPrisma.articleCategory.count.mockResolvedValue(1);

      const response = await service.findAll();
      expect(response).toEqual({
        data,
        total: 1,
        message: 'Catégories récupérés avec succès',
      });
    });

    it('should throw NotFoundException when no categories', async () => {
      mockPrisma.articleCategory.findMany.mockResolvedValue([]);
      await expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return one category', async () => {
      const category = { id: '1', name: 'A', description: 'B' };
      mockPrisma.articleCategory.findUnique.mockResolvedValue(category);

      const response = await service.findOne('1');
      expect(response).toEqual({
        data: category,
        message: 'Catégorie récupéré avec succès',
      });
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.articleCategory.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const dto: UpdateArticleCategoryDto = {
        name: 'Updated',
        description: 'Updated desc',
      };
      const category = { id: '1', ...dto };
      mockPrisma.articleCategory.update.mockResolvedValue(category);

      const response = await service.update('1', dto);
      expect(response).toEqual({
        data: category,
        message: 'Catégorie mis à jour avec succès',
      });
    });

    it('should throw BadRequestException on duplicate', async () => {
      mockPrisma.articleCategory.update.mockRejectedValue({ code: 'P2002' });
      await expect(
        service.update('1', { name: '', description: '' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      mockPrisma.articleCategory.update.mockRejectedValue(new Error('fail'));
      await expect(
        service.update('1', { name: '', description: '' }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      mockPrisma.articleCategory.findUnique.mockResolvedValue({ id: '1' });
      mockPrisma.articleCategory.delete.mockResolvedValue(undefined);

      const response = await service.remove('1');
      expect(response).toEqual({ message: 'Catégorie supprimé avec succès' });
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.articleCategory.findUnique.mockResolvedValue(null);
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException on foreign key constraint', async () => {
      mockPrisma.articleCategory.findUnique.mockResolvedValue({ id: '1' });
      mockPrisma.articleCategory.delete.mockRejectedValue({ code: 'P2003' });

      await expect(service.remove('1')).rejects.toThrow(ForbiddenException);
    });

    it('should throw InternalServerErrorException on unknown error', async () => {
      mockPrisma.articleCategory.findUnique.mockResolvedValue({ id: '1' });
      mockPrisma.articleCategory.delete.mockRejectedValue(new Error('fail'));

      await expect(service.remove('1')).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
