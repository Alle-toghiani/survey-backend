import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SurveysModule } from './surveys/surveys.module';

@Module({
  imports: [SurveysModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
