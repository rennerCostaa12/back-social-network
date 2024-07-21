import { Test, TestingModule } from '@nestjs/testing';
import { PostsSavesController } from './posts-saves.controller';
import { PostsSavesService } from './posts-saves.service';

describe('PostsSavesController', () => {
  let controller: PostsSavesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsSavesController],
      providers: [PostsSavesService],
    }).compile();

    controller = module.get<PostsSavesController>(PostsSavesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
