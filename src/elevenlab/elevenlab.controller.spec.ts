import { Test, TestingModule } from '@nestjs/testing';
import { ElevenlabController } from './elevenlab.controller';

describe('ElevenlabController', () => {
  let controller: ElevenlabController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElevenlabController],
    }).compile();

    controller = module.get<ElevenlabController>(ElevenlabController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
