import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { writeFileSync } from 'fs';
import { config } from 'dotenv';
config();

@Injectable()
export class ElevenLabService {
  private apiKey = process.env.ELEVENLABS_API_KEY;

  async generateVoice(text: string): Promise<string> {
    const url = 'https://api.elevenlabs.io/v1/text-to-speech/default';
    const headers = {
      'xi-api-key': this.apiKey,
      'Content-Type': 'application/json',
    };
    const payload = { text, voice: 'alloy', format: 'mp3' };

    const response = await axios.post(url, payload, {
      headers,
      responseType: 'arraybuffer',
    });

    const audioBuffer = Buffer.from(response.data, 'binary');
    const filePath = `./tts-${Date.now()}.mp3`;
    writeFileSync(filePath, audioBuffer);

    return `http://localhost:${process.env.PORT}/${filePath}`;
  }
}
