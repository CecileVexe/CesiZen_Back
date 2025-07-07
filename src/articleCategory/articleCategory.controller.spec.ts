/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './articleCategory.controller';
import { CategoryService } from './articleCategory.service';
import { CreateArticleCategoryDto } from './dto/create-articleCategory.dto';
import { UpdateArticleCategoryDto } from './dto/update-articleCategory.dto';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  const mockCategoryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a category', async () => {
      const dto: CreateArticleCategoryDto = {
        name: 'Bien-être',
        description: 'Catégorie pour le bien-être',
      };

      const result = {
        data: { id: 'cat-id', ...dto },
        message: 'Catégorie créée',
      };

      mockCategoryService.create.mockResolvedValue(result);

      const response = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const result = {
        data: [],
        message: 'Catégories récupérées',
      };

      mockCategoryService.findAll.mockResolvedValue(result);

      const response = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(response).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return one category by id', async () => {
      const result = {
        data: { id: 'cat-id', name: 'Bien-être' },
        message: 'Catégorie récupérée',
      };

      mockCategoryService.findOne.mockResolvedValue(result);

      const response = await controller.findOne('cat-id');
      expect(service.findOne).toHaveBeenCalledWith('cat-id');
      expect(response).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a category by id', async () => {
      const dto: UpdateArticleCategoryDto = {
        name: 'Santé mentale',
        description: 'Mise à jour de la description',
      };

      const result = {
        data: { id: 'cat-id', ...dto },
        message: 'Catégorie mise à jour',
      };

      mockCategoryService.update.mockResolvedValue(result);

      const response = await controller.update('cat-id', dto);
      expect(service.update).toHaveBeenCalledWith('cat-id', dto);
      expect(response).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should delete a category by id', async () => {
      const result = { message: 'Catégorie supprimée' };

      mockCategoryService.remove.mockResolvedValue(result);

      const response = await controller.remove('cat-id');
      expect(service.remove).toHaveBeenCalledWith('cat-id');
      expect(response).toEqual(result);
    });
  });
});
