import { Test, TestingModule } from '@nestjs/testing';
import { TwilioGateway } from './twilio.gateway';

describe('TwilioGateway', () => {
  let gateway: TwilioGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwilioGateway],
    }).compile();

    gateway = module.get<TwilioGateway>(TwilioGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
