import { Module } from '@nestjs/common';
import { TwilioController } from './twilio.controller';
import { TwilioService } from './twilio.service';
import { ElevenLabService } from 'src/eleven-lab/eleven-lab.service';
import { ElevenLabModule } from 'src/eleven-lab/eleven-lab.module';

@Module({
  imports:[ElevenLabModule],
  controllers: [TwilioController],
  providers: [TwilioService]
})
export class TwilioModule {}
