import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { UsersHttpService } from './services/users-http.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HttpModule
  ],
  providers: [
    UsersService,
    UsersHttpService
  ],
  exports: [UsersService]
})
export class UsersModule {}
