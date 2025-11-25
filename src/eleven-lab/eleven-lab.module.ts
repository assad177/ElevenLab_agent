import { Module } from '@nestjs/common';
import { ElevenLabService } from './eleven-lab.service';

@Module({
  providers: [ElevenLabService],
  exports:[ElevenLabService]
})
export class ElevenLabModule {}
