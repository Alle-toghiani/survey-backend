import {
    Injectable,
    BadRequestException,
    NotFoundException,
    HttpStatus,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';

  import { promisify } from 'util';
  import { randomBytes, scrypt as _scrypt } from 'crypto';

  import { AccessTokenModel } from './models/access-token.model';
  
import { UsersService } from 'src/users/services/users.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateModDto } from 'src/users/dtos/create-mod.dto';
  
  const scrypt = promisify(_scrypt);
  
  @Injectable()
  export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
        ) {}
  
    async signup(data: CreateUserDto) {
      // See if email is in usea
      const users = await this.usersService.find(data.username);
      if (users.length) {
        throw new BadRequestException('username in use');
      }
      
      const usersCheckEmail = await this.usersService.findEmail(data.email);
      if (users.length) {
        throw new BadRequestException('email in use');
      }

      // Hash the users password
      // Generate a salt
      const salt = randomBytes(8).toString('hex');
  
      // Hash the salt and the password together
      const hash = (await scrypt(data.password, salt, 32)) as Buffer;
  
      // Join the hashed result and the salt together
      const result = salt + '.' + hash.toString('hex');
  
      // Create a new user and save it
      const user = await this.usersService.create(data.username, data.email, result);
  
      // return the user
      return user;
    }
  
    async signin(data: CreateUserDto) {
      let [user] = await this.usersService.find(data.username);
      if (!user) {
        const [userEmail] = await this.usersService.findEmail(data.username);
        if (!userEmail) {
          throw new NotFoundException('user not found');
        } else {
          user = userEmail;
        }
      }
  
      const [salt, storedHash] = user.password.split('.');
  
      const hash = (await scrypt(data.password, salt, 32)) as Buffer;
  
      if (storedHash !== hash.toString('hex')) {
        throw new BadRequestException('bad password');
      }
      
      return this.getAccessToken(user);
    }

    getAccessToken(user: User){
      let payload: AccessTokenModel = { 
        username: user.username,
        role: user.parentId ? 'MOD' : 'ADMIN',
        hasToken: !!(!user.parentId && user.apiToken)
        };

      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    
    async setApiToken(username: string, apiToken: string){
      const updateUserApiTokenRes = await this.usersService.setApiToken(username, apiToken);
      return this.getAccessToken(updateUserApiTokenRes);
    }

    async createMod(admin: User, modUserName: string) {
      // See if email is in usea
      const users = await this.usersService.find(modUserName);
      if (users.length) {
        throw new BadRequestException('username in use');
      }

      // Hash the users password
      // Generate a salt
      const salt = randomBytes(8).toString('hex');

      const generatedPassword = this._generateRandomPassword();
  
      // Hash the salt and the password together
      const hash = (await scrypt(generatedPassword, salt, 32)) as Buffer;
  
      // Join the hashed result and the salt together
      const hashedSaltedPassword = salt + '.' + hash.toString('hex');

      const modData: CreateModDto = {
        username: modUserName,
        password: hashedSaltedPassword,
        parentId: admin.username,
      }
  
      // Create a new user and save it
      const user = await this.usersService.createMod(modData);
  
      // return the user
      if (user){
        return {
          username: user.username,
          password: generatedPassword
        }
      }
    }

    private _generateRandomPassword(): string{
      var pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      var pwdLen = 10;
      return Array(pwdLen).fill(pwdChars).map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');
    }

    async getModsList(user: User){
      return this.usersService.getModsList(user.username);
    }

    async deleteMod(user: User, modUserName){
      const modData = await this.usersService.findOne(modUserName);
      if (modData.parentId === user.username){
        return this.usersService.remove(modUserName);
      }
    }
  }
  