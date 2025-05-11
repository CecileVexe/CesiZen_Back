/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ArticleController } from './Article.controller';
import { ArticleService } from './Article.service';
import { CreateArticleDto } from './dto/create-Article.dto';
import { UpdateArticleDto } from './dto/update-Article.dto';

describe('ArticleController', () => {
  let controller: ArticleController;
  let service: ArticleService;

  const mockArticleService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        {
          provide: ArticleService,
          useValue: mockArticleService,
        },
      ],
    }).compile();

    controller = module.get<ArticleController>(ArticleController);
    service = module.get<ArticleService>(ArticleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call articleService.create with correct data', async () => {
      const dto: CreateArticleDto = {
        title: 'Test Article',
        description: 'Short description',
        content: 'Long content',
        readingTime: 5,
        categoryId: 'category123',
      };
      const mockBanner = {
        buffer: Buffer.from(''),
        mimetype: 'image/png',
        size: 1000,
      } as Express.Multer.File;

      const result = { data: {}, message: 'Article créé avec succès' };
      mockArticleService.create.mockResolvedValue(result);

      const response = await controller.create(mockBanner, dto);
      expect(service.create).toHaveBeenCalledWith(dto, mockBanner);
      expect(response).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return paginated articles', async () => {
      const result = {
        data: [],
        total: 0,
        page: 1,
        pageSize: 50,
        message: 'Articles récupérés avec succès',
      };
      mockArticleService.findAll.mockResolvedValue(result);

      const response = await controller.findAll('1', '50', 'createdAt', 'desc');
      expect(service.findAll).toHaveBeenCalledWith(
        1,
        50,
        'createdAt',
        'desc',
        undefined,
      );
      expect(response).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single article', async () => {
      const result = {
        data: {},
        message: 'Articles récupéré avec succès',
      };
      mockArticleService.findOne.mockResolvedValue(result);

      const response = await controller.findOne('article-id');
      expect(service.findOne).toHaveBeenCalledWith('article-id');
      expect(response).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update an article', async () => {
      const dto: UpdateArticleDto = {
        title: 'Updated title',
        content: 'Updated content',
        readingTime: 6,
        description: 'Updated desc',
        categoryId: 'category456',
      };
      const banner = {
        buffer: Buffer.from(''),
        mimetype: 'image/jpeg',
        size: 1000,
      } as Express.Multer.File;

      const result = {
        data: {},
        message: 'Article mis à jour avec succès',
      };
      mockArticleService.update.mockResolvedValue(result);

      const response = await controller.update('article-id', banner, dto);
      expect(service.update).toHaveBeenCalledWith('article-id', dto, banner);
      expect(response).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should delete an article', async () => {
      const result = { message: 'Article supprimé avec succès' };
      mockArticleService.remove.mockResolvedValue(result);

      const response = await controller.remove('article-id');
      expect(service.remove).toHaveBeenCalledWith('article-id');
      expect(response).toEqual(result);
    });
  });
});
