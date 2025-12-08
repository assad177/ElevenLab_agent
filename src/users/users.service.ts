import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userrepo: Repository<User>) {}

  async listAllUsers(): Promise<User[]> {
    const users = await this.userrepo.find();
    console.log(users);
    if (!users.length) throw new NotFoundException('users not founds');
    return users;
  }

  async findUser(id: any) {
    return await this.userrepo.findOne({ where: { id } });
  }

  async signUp(signupdto: SignUpDto) {
    const { password, email, ...rest } = signupdto;
    // const userexists = await this.userrepo.findOne({ where: { email } });
    // if (userexists) throw new ConflictException('user already exists');
    const hashPassword = await bcrypt.hash(password, 10);
    console.log('user saved successsfully');
    const newUser = await this.userrepo.save({
      ...rest,
      email,
      password: hashPassword,
    });
    const { password: _, ...user } = newUser;
    return user;
  }
}

// cloudflare link
