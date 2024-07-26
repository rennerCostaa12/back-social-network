import { Test, TestingModule } from '@nestjs/testing';
import { EmoticonsDriverService } from './emoticons-driver.service';

describe('EmoticonsDriverService', () => {
  let service: EmoticonsDriverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmoticonsDriverService],
    }).compile();

    service = module.get<EmoticonsDriverService>(EmoticonsDriverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
