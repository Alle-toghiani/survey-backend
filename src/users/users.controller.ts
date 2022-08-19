import { Controller, Body, Post, Param, Get, NotFoundException, Query, Delete, Patch } from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';

@Controller('auth')
export class UsersController {

  constructor(
    private usersService: UsersService,
    private authService: AuthService
    ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body.email, body.password);
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto) {
    const user = await this.authService.signin(body.email, body.password);
    return user;
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  // @Post('/signout')
  // signOut() {
  // }

  // @Get('/:id')
  // async findUser(@Param('id') id: string) {
  //   const user = await this.usersService.findOne(parseInt(id));
  //   if (!user) {
  //     throw new NotFoundException('user not found');
  //   }
  //   return user;
  // }

  // @Get()
  // findAllUsers(@Query('email') email: string) {
  //   return this.usersService.find(email);
  // }

//   @Patch('/:id')
//   updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
//     return this.usersService.update(parseInt(id), body);
//   }
}
