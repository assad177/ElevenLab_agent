import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { TwilioService } from './twilio/twilio.service';  // ✅ ADD THIS

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  
 const twilioService = app.get(TwilioService);
  await app.init(); 
  twilioService.initServer(app.getHttpServer());
  
  app.enableCors({
    origin: 'http://localhost:3001',
  });
  
  await app.listen(3000);
  console.log('the app is running on port 3000');
}
bootstrap();