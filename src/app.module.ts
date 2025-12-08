import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './config/tyepOrm.config';
import { ConfigModule } from '@nestjs/config';
import { ElevenlabModule } from './elevenlab/elevenlab.module';

import { TwilioModule } from './twilio/twilio.module';




@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({ ...AppDataSource.options, autoLoadEntities: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    ElevenlabModule,
    TwilioModule,
    
  ],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}
