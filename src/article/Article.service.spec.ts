/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './Article.service';
import { PrismaService } from 'src/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ArticleService', () => {
  let service: ArticleService;
  let prisma: PrismaService;

  const mockPrismaService = {
    article: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    image: {
      create: jest.fn(),
      delete: jest.fn(),
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('devrait créer un article sans bannière', async () => {
      const dto = {
        title: 'Titre test',
        content: 'Contenu test',
        readingTime: 5,
        description: 'desc',
        categoryId: 'cat123',
      };
      const mockArticle = {
        id: '1',
        ...dto,
        category: { id: 'cat123', name: 'Catégorie' },
        bannerId: null,
      };

      mockPrismaService.article.create.mockResolvedValue(mockArticle);

      const result = await service.create(dto);

      expect(mockPrismaService.article.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining(dto),
        }),
      );
      expect(result.data).toEqual(mockArticle);
    });

    it('devrait lancer une exception pour une mauvaise bannière', async () => {
      const dto = {
        title: 'Test',
        content: '...',
        readingTime: 1,
        description: '...',
        categoryId: 'cat123',
      };
      const fakeFile = {
        mimetype: 'text/plain',
        size: 500,
      } as Express.Multer.File;

      await expect(service.create(dto, fakeFile)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('devrait retourner une liste d’articles', async () => {
      const articles = [
        {
          id: '1',
          title: 'Article 1',
          readingTime: 3,
          description: 'desc',
          content: '...',
          category: { id: '1', name: 'Cat' },
          bannerId: null,
        },
      ];
      mockPrismaService.article.findMany.mockResolvedValue(articles);
      mockPrismaService.article.count.mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('devrait lancer une exception si aucun article trouvé', async () => {
      mockPrismaService.article.findMany.mockResolvedValue([]);

      await expect(service.findAll(1, 10)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('devrait retourner un article trouvé', async () => {
      const article = {
        id: '1',
        title: 'Titre',
        readingTime: 3,
        content: '...',
        description: '...',
        category: { id: 'cat', name: 'cat' },
        bannerId: null,
      };
      mockPrismaService.article.findUnique.mockResolvedValue(article);

      const result = await service.findOne('1');

      expect(result.data).toEqual(article);
    });

    it('devrait lancer une exception si non trouvé', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(null);

      await expect(service.findOne('inexistant')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('devrait supprimer un article avec bannière', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue({
        bannerId: 'img123',
      });
      mockPrismaService.article.delete.mockResolvedValue({});
      mockPrismaService.image.delete.mockResolvedValue({});

      const result = await service.remove('1');
      expect(result.message).toBe('Article supprimé avec succès');
    });

    it('devrait lancer une erreur si article non trouvé', async () => {
      mockPrismaService.article.findUnique.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
