/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { EmotionController } from './emotion.controller';
import { EmotionService } from './emotion.service';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import { UpdateEmotionDto } from './dto/update-emotion.dto';
import { EmotionType } from 'src/utils/types/PrismaApiModel.type';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';

describe('EmotionController', () => {
  let controller: EmotionController;
  let service: jest.Mocked<EmotionService>;

  const mockEmotion: EmotionType = {
    id: '1',
    name: 'Joie',
    color: '#FFD700',
    emotionCategoryId: 'cat1',
    emotionCategory: {
      id: 'cat1',
      name: 'joyeux',
      color: 'FFD700',
      smiley: 'emoticon-angry',
    },
  };

  const mockEmotionService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmotionController],
      providers: [
        {
          provide: EmotionService,
          useValue: mockEmotionService,
        },
      ],
    }).compile();

    controller = module.get<EmotionController>(EmotionController);
    service = module.get(EmotionService);
  });

  describe('create', () => {
    it('should call EmotionService.create with correct data', async () => {
      const dto: CreateEmotionDto = {
        name: 'Joie',
        color: '#FFD700',
        emotionCategoryId: 'cat1',
      };
      const expected: ApiReturns<EmotionType> = {
        data: mockEmotion,
        message: 'Émotion créée',
      };
      service.create.mockResolvedValue(expected);

      const result = await controller.create(dto);
      expect(result).toEqual(expected);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all emotions', async () => {
      const expected: ApiReturns<EmotionType[]> = {
        data: [mockEmotion],
        message: 'Émotions récupérées',
        total: 1,
      };
      mockEmotionService.findAll?.mockResolvedValue(expected);

      const result = await controller.findAll();
      expect(result).toEqual(expected);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return one emotion by id', async () => {
      const expected: ApiReturns<EmotionType> = {
        data: mockEmotion,
        message: 'Émotion récupérée',
      };
      service.findOne.mockResolvedValue(expected);

      const result = await controller.findOne('1');
      expect(result).toEqual(expected);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update an emotion', async () => {
      const dto: UpdateEmotionDto = {
        name: 'Tristesse',
        color: '#0000FF',
        emotionCategoryId: 'cat2',
      };
      const expected: ApiReturns<EmotionType> = {
        data: { ...mockEmotion, ...dto },
        message: 'Émotion mise à jour',
      };
      service.update.mockResolvedValue(expected);

      const result = await controller.update('1', dto);
      expect(result).toEqual(expected);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove an emotion', async () => {
      const expected = { message: 'Émotion supprimée' };
      service.remove.mockResolvedValue(expected);

      const result = await controller.remove('1');
      expect(result).toEqual(expected);
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
