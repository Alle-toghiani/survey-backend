import { Module } from '@nestjs/common';
import { TypeOrmModule} from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SurveysModule } from './surveys/surveys.module';
import { Survey } from './surveys/entities/survey.entity';

import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'mongodb',
      database: 'survey',
      useNewUrlParser: true,
      autoLoadEntities: true,
      useUnifiedTopology: true,
      entities: [Survey, User],
      synchronize: true,
    }),
    SurveysModule,
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
})
export class AppModule {}
