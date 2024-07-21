import { Test, TestingModule } from '@nestjs/testing';
import { PostsSavesService } from './posts-saves.service';

describe('PostsSavesService', () => {
  let service: PostsSavesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsSavesService],
    }).compile();

    service = module.get<PostsSavesService>(PostsSavesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
