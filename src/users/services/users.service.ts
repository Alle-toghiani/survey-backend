import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenModel } from 'src/auth/models/access-token.model';

import { Repository } from 'typeorm';
import { CreateModDto } from '../dtos/create-mod.dto';

import { User } from '../entities/user.entity';
import { UsersHttpService } from './users-http.service';

@Injectable()
export class UsersService {

  currentUser: AccessTokenModel;

  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private usersHttpService: UsersHttpService
    ) {}

  setCurrentUser(user: AccessTokenModel){
    this.currentUser = user;
  }

  get getCurrentUser(): AccessTokenModel{
    return this.currentUser;
  }

  createMod(mod: CreateModDto){
      const user = this.repo.create({...mod, surveys: []});
      return this.repo.save(user);
  }

  getModsList(username: string){
    return this.repo.find({ select: ['username', 'surveys'], where:{ parentId: username}})
  }

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
    const userSurveys = user.surveys;

    if (!user) {
      throw new NotFoundException('user not found');
    }

    Object.assign(user, attrs);
    if (attrs.surveys){
      Object.assign(user, {...user, surveys: [...userSurveys, ...attrs.surveys]})
    }
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
