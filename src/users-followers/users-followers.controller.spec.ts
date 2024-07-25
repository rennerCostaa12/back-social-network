import { Test, TestingModule } from '@nestjs/testing';
import { UsersFollowersController } from './users-followers.controller';
import { UsersFollowersService } from './users-followers.service';

describe('UsersFollowersController', () => {
  let controller: UsersFollowersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersFollowersController],
      providers: [UsersFollowersService],
    }).compile();

    controller = module.get<UsersFollowersController>(UsersFollowersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
