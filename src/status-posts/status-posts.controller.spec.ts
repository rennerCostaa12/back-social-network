import { Test, TestingModule } from '@nestjs/testing';
import { StatusPostsController } from './status-posts.controller';
import { StatusPostsService } from './status-posts.service';

describe('StatusPostsController', () => {
  let controller: StatusPostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusPostsController],
      providers: [StatusPostsService],
    }).compile();

    controller = module.get<StatusPostsController>(StatusPostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
