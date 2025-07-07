/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { EmotionCategoryController } from './emotionCategory.controller';
import { EmotionCategoryService } from './emotionCategory.service';
import { CreateEmotionCategoryDto } from './dto/create-emotionCategory.dto';
import { UpdateEmotionCategoryDto } from './dto/update-emotionCategory.dto';

describe('EmotionCategoryController', () => {
  let controller: EmotionCategoryController;
  let service: jest.Mocked<EmotionCategoryService>;

  const mockCategory = {
    id: '1',
    name: 'Joie',
    color: '#FFD700',
    smiley: 'emoticon-joy',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmotionCategoryController],
      providers: [
        {
          provide: EmotionCategoryService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EmotionCategoryController>(
      EmotionCategoryController,
    );
    service = module.get(EmotionCategoryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with correct dto', async () => {
      const dto: CreateEmotionCategoryDto = {
        name: 'Joie',
        color: '#FFD700',
        smiley: 'emoticone-joy',
      };
      service.create.mockResolvedValue({
        data: mockCategory,
        message: 'message',
      });

      const result = await controller.create(dto);
      expect(result).toEqual({ data: mockCategory, message: 'message' });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all emotion categories', async () => {
      service.findAll.mockResolvedValue({
        data: [mockCategory],
        total: 1,
        message: 'message',
      });

      const result = await controller.findAll();
      expect(result).toEqual({
        data: [mockCategory],
        message: 'message',
        total: 1,
      });
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      service.findOne.mockResolvedValue({
        data: mockCategory,
        message: 'message',
      });

      const result = await controller.findOne('1');
      expect(result).toEqual({ data: mockCategory, message: 'message' });
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a category by id', async () => {
      const dto: UpdateEmotionCategoryDto = {
        name: 'Tristesse',
        color: '#0000FF',
        smiley: 'emoticon-sad',
      };
      const updatedCategory = { ...mockCategory, ...dto };
      service.update.mockResolvedValue({
        data: updatedCategory,
        message: 'message',
      });

      const result = await controller.update('1', dto);
      expect(result).toEqual({ data: updatedCategory, message: 'message' });
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a category by id', async () => {
      service.remove.mockResolvedValue({ message: 'Deleted' });

      const result = await controller.remove('1');
      expect(result).toEqual({ message: 'Deleted' });
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
