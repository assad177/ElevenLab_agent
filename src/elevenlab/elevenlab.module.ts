import { Module } from '@nestjs/common';
import { ElevenlabController } from './elevenlab.controller';
import { ElevenLabService } from './elevenlab.service';

@Module({
  imports:[ ],
  controllers: [ElevenlabController],
  providers: [ElevenLabService],
  exports:[ElevenLabService]
})
export class ElevenlabModule {}
