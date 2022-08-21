import { Body, Controller, Delete, Param, Post } from '@nestjs/common';

import { Public } from 'src/common/decorators/public-route.decorator';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
        ) {}

    @Public()
    @Post('/signup')
    async createUser(@Body() body: CreateUserDto) {

      try{
        const user = await this.authService.signup(body);
        return new ResponseSuccess("AUTH.SIGNUP.SUCCESS");
        
      }
      catch(error) {
          return new ResponseError("AUTH.SIGNUP.ERROR", error)
      }
    }
  
    @Public()
    @Post('/signin')
    async signin(@Body() body: CreateUserDto) {
      try{
        const token = await this.authService.signin(body);
        return new ResponseSuccess("AUTH.SIGNIN.SUCCESS", token);
        
      }
      catch(error) {
          return new ResponseError("AUTH.SIGNIN.ERROR", error)
      }
    }
  
    @Delete('/:id')
    removeUser(@Param('id') id: string) {
    //   return this.usersService.remove(parseInt(id));
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
