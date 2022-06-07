import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SurveysModule } from './surveys/surveys.module';
import { TypeOrmModule} from '@nestjs/typeorm';
import { join } from 'path';
import { Survey } from './surveys/entities/survey.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'mongodb',
      database: 'survey',
      useNewUrlParser: true,
      autoLoadEntities: true,
      useUnifiedTopology: true,
      entities: [Survey],
      synchronize: true,
    }),
    SurveysModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
