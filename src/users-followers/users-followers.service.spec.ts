import { Test, TestingModule } from '@nestjs/testing';
import { UsersFollowersService } from './users-followers.service';

describe('UsersFollowersService', () => {
  let service: UsersFollowersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersFollowersService],
    }).compile();

    service = module.get<UsersFollowersService>(UsersFollowersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
