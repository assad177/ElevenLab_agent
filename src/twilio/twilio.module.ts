import { Module } from '@nestjs/common';
import { TwilioService } from './twilio.service';
// import { TwilioGateway } from './twilio.gateway';

@Module({
  providers: [ TwilioService],
  exports: [TwilioService],  
})
export class TwilioModule {}