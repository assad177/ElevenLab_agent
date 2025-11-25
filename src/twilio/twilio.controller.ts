import { Controller, Get, Post, Body, Query, Res } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { identity } from 'rxjs';

@Controller('twilio')
export class TwilioController {
  constructor(private twilioService: TwilioService) {}
  @Get('token')
  getToken(@Query('identity') identity: string) {
    return this.twilioService.generateToken(identity);
  }
  @Post('voice')
  makeCall(@Body() body: any,@Res() res: Response) {
   console.log('--------------')
    return this.twilioService.makeCall(body.To,res);
  }
}
