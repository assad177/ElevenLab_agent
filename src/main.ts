import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors({
    origin: 'http://localhost:3001', 
     
  });
  await app.listen(process.env.PORT ?? 3000);
  console.log('the app is running on port 3000')
  // console.log('the running port is ',process.env.PORT)
  // console.log('twilio credentials:',process.env.TWILIO_API_KEY_SID)
}
bootstrap();
