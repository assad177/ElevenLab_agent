import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { UsersService } from './users.service';
import { SignUpDto } from './dto/sign-up.dto';
@Controller('users')
export class UsersController {
  constructor(private readonly userservice: UsersService) {}

  @Get()
  async getAllUsers() {
    return await this.userservice.listAllUsers();
  }
  @Get(':id')
  finduser(@Param('id') id: any) {
    return this.userservice.findUser(id);
  }
  @Post()
  async signup(@Body() signupdto: SignUpDto) {
    console.log(signupdto);
    return await this.userservice.signUp(signupdto);
  }
}
