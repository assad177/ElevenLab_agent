import { Test, TestingModule } from '@nestjs/testing';
import { ElevenlabService } from './elevenlab.service';

describe('ElevenlabService', () => {
  let service: ElevenlabService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElevenlabService],
    }).compile();

    service = module.get<ElevenlabService>(ElevenlabService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
