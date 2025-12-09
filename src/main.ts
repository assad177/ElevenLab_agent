import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TwilioService } from './twilio/twilio.service';
import * as http from 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const server = http.createServer(app.getHttpAdapter().getInstance());

  
  const twilioService = app.get(TwilioService);
  twilioService.initServer(server);

  await server.listen(3000, () => {
    console.log('🌐 Server listening on http://134.199.166.202:3000');
  });
}
bootstrap();
