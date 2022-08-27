import { Body, Controller, Delete, Get, Param, Post, Request } from '@nestjs/common';

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

    @Post('/api-token')
    async modifyApiToken(@Request() req: any, @Body() body: {apiToken: string}) {
        try{
            const response = await this.authService.setApiToken(req.user.username, body.apiToken);
            return new ResponseSuccess("API-TOKEN.SUBMIT.SUCCESS", response);
        }
        catch(error) {
            return new ResponseError("API-TOKEN.SUBMIT.ERROR", error)
        }
    }

    @Get('/mods')
    async getModsList(@Request() req: any) {
      try{
        const response = await this.authService.getModsList(req.user);
        return new ResponseSuccess("MOD.LIST.SUCCESS", response);
      }
      catch(error) {
          return new ResponseError("MOD.LIST.ERROR", error)
      }
    }

    @Delete('/mods')
    async deleteMod(@Request() req: any, @Body() body: {username: string}) {
      try{
        const response = await this.authService.deleteMod(req.user, body.username);
        return new ResponseSuccess("MOD.DELETE.SUCCESS", response);
      }
      catch(error) {
          return new ResponseError("MOD.DELETE.ERROR", error)
      }
    }

    @Post('/mods/create')
    async createModerator(@Request() req: any, @Body() body: {username:string}) {
      try{
        const response = await this.authService.createMod(req.user, body.username);
        return new ResponseSuccess("MOD.CREATE.SUCCESS", response);
      }
      catch(error) {
          return new ResponseError("MOD.CREATE.ERROR", error)
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
