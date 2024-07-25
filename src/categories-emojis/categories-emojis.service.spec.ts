import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesEmojisService } from './categories-emojis.service';

describe('CategoriesEmojisService', () => {
  let service: CategoriesEmojisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesEmojisService],
    }).compile();

    service = module.get<CategoriesEmojisService>(CategoriesEmojisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
