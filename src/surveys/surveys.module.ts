import { Module } from '@nestjs/common';
import { SurveyController } from './controllers/survey.controller';
import { SurveyService } from './services/survey.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './survey.entity';


@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Survey])],
  controllers: [SurveyController],
  providers: [SurveyService]
})
export class SurveysModule {}
