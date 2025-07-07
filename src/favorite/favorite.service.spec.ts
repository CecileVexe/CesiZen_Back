import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteService } from './favorite.service';
import { PrismaService } from 'src/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    article: {
      findUnique: jest.fn(),
    },
    favorite: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockUser = {
    id: 'user1',
    favorites: [
      {
        id: 'fav1',
        article: { id: 'article1', title: 'Article test' },
      },
    ],
  };

  const mockFavorite = {
    id: 'fav1',
    userId: 'user1',
    articleId: 'article1',
    article: { id: 'article1', title: 'Article test' },
  };

  const createDto: CreateFavoriteDto = {
    userId: 'user1',
    articleId: 'article1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getFavoritesOfUser', () => {
    it('should return favorites of a user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.getFavoritesOfUser('user1');
      expect(result).toEqual({
        data: [
          {
            id: 'fav1',
            article: { id: 'article1', title: 'Article test' },
          },
        ],
        message: 'Favoris récupérés avec succès',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.getFavoritesOfUser('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createFavorite', () => {
    it('should create a favorite if not existing', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({
        id: 'article1',
      });
      mockPrismaService.favorite.findUnique.mockResolvedValue(null);
      mockPrismaService.favorite.create.mockResolvedValue(mockFavorite);

      const result = await service.createFavorite(createDto);
      expect(result).toEqual(mockFavorite);
    });

    it('should throw NotFoundException if article not found', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(null);

      await expect(service.createFavorite(createDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if favorite already exists', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({
        id: 'article1',
      });
      mockPrismaService.favorite.findUnique.mockResolvedValue(mockFavorite);

      await expect(service.createFavorite(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('removeFavorite', () => {
    it('should delete a favorite successfully', async () => {
      mockPrismaService.favorite.delete.mockResolvedValue({ id: 'fav1' });

      const result = await service.removeFavorite('fav1');
      expect(result).toEqual({ id: 'fav1' });
    });

    it('should throw NotFoundException if favorite not found', async () => {
      mockPrismaService.favorite.delete.mockRejectedValue(new Error());

      await expect(service.removeFavorite('invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
