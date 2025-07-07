/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

describe('FavoriteController', () => {
  let controller: FavoriteController;
  let service: FavoriteService;

  const mockFavorite = {
    id: 'fav1',
    userId: 'user1',
    articleId: 'article1',
  };

  const mockFavorites = [mockFavorite];

  const mockFavoriteService = {
    getFavoritesOfUser: jest.fn(),
    createFavorite: jest.fn(),
    removeFavorite: jest.fn(),
  };

  const createDto: CreateFavoriteDto = {
    userId: 'user1',
    articleId: 'article1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteController],
      providers: [
        {
          provide: FavoriteService,
          useValue: mockFavoriteService,
        },
      ],
    }).compile();

    controller = module.get<FavoriteController>(FavoriteController);
    service = module.get<FavoriteService>(FavoriteService);
  });

  describe('getFavoritesForUser', () => {
    it('should return favorites for a user', async () => {
      mockFavoriteService.getFavoritesOfUser.mockResolvedValue(mockFavorites);

      const result = await controller.getFavoritesForUser('user1');
      expect(result).toEqual(mockFavorites);
      expect(service.getFavoritesOfUser).toHaveBeenCalledWith('user1');
    });
  });

  describe('addFavorite', () => {
    it('should create a favorite', async () => {
      mockFavoriteService.createFavorite.mockResolvedValue(mockFavorite);

      const result = await controller.addFavorite(createDto);
      expect(result).toEqual(mockFavorite);
      expect(service.createFavorite).toHaveBeenCalledWith(createDto);
    });
  });

  describe('removeFavorite', () => {
    it('should remove a favorite', async () => {
      mockFavoriteService.removeFavorite.mockResolvedValue({
        message: 'Favori supprimé avec succès',
      });

      const result = await controller.removeFavorite('fav1');
      expect(result).toEqual({ message: 'Favori supprimé avec succès' });
      expect(service.removeFavorite).toHaveBeenCalledWith('fav1');
    });
  });
});
