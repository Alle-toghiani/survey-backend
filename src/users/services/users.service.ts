import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(username: string, email: string, password: string) {
      const user = this.repo.create({ username, email, password });
      return this.repo.save(user);
  }
  
  findOne(username: string) {
    return this.repo.findOne({ username });
  }

  // FIXME: use one find method with optional email parameter
  find(username: string){
    return this.repo.find({ username });
  }

  findEmail(email: string) {
    return this.repo.find({ email });
  }

  async update(username: string, attrs: Partial<User>) {
    const user = await this.findOne(username);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(username: string) {
    const user = await this.findOne(username);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return this.repo.remove(user);
  }
}
