import { Test, TestingModule } from '@nestjs/testing';
import { ElevenLabService } from './eleven-lab.service';

describe('ElevenLabService', () => {
  let service: ElevenLabService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ElevenLabService],
    }).compile();

    service = module.get<ElevenLabService>(ElevenLabService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
