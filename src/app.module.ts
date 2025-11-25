import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './config/tyepOrm.config';
import { TwilioModule } from './twilio/twilio.module';
import { ElevenLabModule } from './eleven-lab/eleven-lab.module';

@Module({
  imports: [UsersModule,TypeOrmModule.forRoot({...AppDataSource.options,autoLoadEntities:true}), TwilioModule, ElevenLabModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
