import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { UsersHttpService } from './users-http.service';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private usersHttpService: UsersHttpService
    ) {}

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

  async setApiToken(username: string, apiToken: string){
    const user = await this.findOne(username);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    if (user.parentId) {
      throw new UnauthorizedException('only admins can set api token')
    }

    const isTokenValid = await this.isTokenValid(apiToken);
    if (!isTokenValid) {
      throw new UnauthorizedException('Invalid token');
    } else {
      const updatedUser = {...user, apiToken: apiToken};
      return this.update(user.username, updatedUser);
    }
  }

  async isTokenValid(apiToken: string){
    return new Promise(
      resolve => {
        this.usersHttpService.getFolders(apiToken).subscribe(
          {
            next: (getFolderRes) => resolve(getFolderRes.status === HttpStatus.OK),
            error: () => resolve(false)
          }
        )
      }
    )
  }
}
