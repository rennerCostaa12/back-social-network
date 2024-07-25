import { Test, TestingModule } from '@nestjs/testing';
import { EmoticonsController } from './emoticons.controller';
import { EmoticonsService } from './emoticons.service';

describe('EmoticonsController', () => {
  let controller: EmoticonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmoticonsController],
      providers: [EmoticonsService],
    }).compile();

    controller = module.get<EmoticonsController>(EmoticonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
