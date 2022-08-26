import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule, HttpService } from '@nestjs/axios';

import { SurveyController } from './controllers/survey.controller';
import { Survey } from './entities/survey.entity';

import { SurveyService } from './services/survey.service';
import { SurveysHttpService } from './services/surveys-http.service';

import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/services/users.service';


@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Survey]),
    UsersModule
  ],
  controllers: [SurveyController],
  providers: [
    SurveyService,
    SurveysHttpService
  ]
})
export class SurveysModule implements OnModuleInit {
  constructor(
    private httpService: HttpService,
    private usersService: UsersService
    ){}

  async onModuleInit() {
    this.httpService.axiosRef.interceptors.request.use( async config => {
      if (!config.url.includes('https://survey.porsline.ir/r/')){
        const userPayload = this.usersService.getCurrentUser;
        if (!userPayload.parentId){
          // User is Admin
          const user = await this.usersService.findOne(userPayload.username);
          if (user.apiToken){
            config.headers = {...config.headers, 'Authorization': user.apiToken}
          }
        } else {
          // User is Mod

        }
      }
      return config;
    })
  }
}
