import { Module } from '@nestjs/common';
import { TypeOrmModule} from '@nestjs/typeorm';

import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SurveysModule } from './surveys/surveys.module';
import { Survey } from './surveys/entities/survey.entity';

import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';

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
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
