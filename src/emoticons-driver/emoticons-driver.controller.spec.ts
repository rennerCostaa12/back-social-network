import { Test, TestingModule } from '@nestjs/testing';
import { EmoticonsDriverController } from './emoticons-driver.controller';
import { EmoticonsDriverService } from './emoticons-driver.service';

describe('EmoticonsDriverController', () => {
  let controller: EmoticonsDriverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmoticonsDriverController],
      providers: [EmoticonsDriverService],
    }).compile();

    controller = module.get<EmoticonsDriverController>(EmoticonsDriverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
