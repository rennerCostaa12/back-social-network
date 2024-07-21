import { Test, TestingModule } from '@nestjs/testing';
import { StatusPostsService } from './status-posts.service';

describe('StatusPostsService', () => {
  let service: StatusPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusPostsService],
    }).compile();

    service = module.get<StatusPostsService>(StatusPostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
