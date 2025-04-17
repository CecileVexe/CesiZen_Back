import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './emotionCategory.controller';
import { EmotionCategoryService } from './emotionCategory.service';

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [EmotionCategoryService],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
