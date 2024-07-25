import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesEmojisController } from './categories-emojis.controller';
import { CategoriesEmojisService } from './categories-emojis.service';

describe('CategoriesEmojisController', () => {
  let controller: CategoriesEmojisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesEmojisController],
      providers: [CategoriesEmojisService],
    }).compile();

    controller = module.get<CategoriesEmojisController>(CategoriesEmojisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
