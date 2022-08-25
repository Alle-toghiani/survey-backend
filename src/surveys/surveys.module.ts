import { Module } from '@nestjs/common';
import { SurveyController } from './controllers/survey.controller';
import { SurveyService } from './services/survey.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { SurveysHttpService } from './services/surveys-http.service';


@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Survey])],
  controllers: [SurveyController],
  providers: [
    SurveyService,
    SurveysHttpService
  ]
})
export class SurveysModule {}
