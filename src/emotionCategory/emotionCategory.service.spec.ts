import { Test, TestingModule } from '@nestjs/testing';
import { EmotionCategoryService } from './emotionCategory.service';

describe('CategoryService', () => {
  let service: EmotionCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmotionCategoryService],
    }).compile();

    service = module.get<EmotionCategoryService>(EmotionCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
