import { HttpService } from '@nestjs/axios';
import { Injectable , HttpStatus, HttpException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom, Observable, from, zip, map, tap, switchMap, catchError} from 'rxjs';
import { Repository } from 'typeorm';
import { SurveyQuestion } from '../entities/survey-question.entity';
import { Survey } from '../entities/survey.entity';

@Injectable()
export class SurveyService {
    headers = {headers: {'Authorization': 'API-Key c0e852745ab0eea1727a21c98ebf093276a40253'}};

    constructor(
        @InjectRepository(Survey)private readonly surveyRepository: Repository<Survey>,
         private httpService: HttpService){}

    async fetchSurveyDatafromApi(surveyId: number): Promise<any>{
        const questionReq = await firstValueFrom(this.httpService.get('https://survey.porsline.ir/api/surveys/'+ surveyId, this.headers))
        const answerReq = await firstValueFrom(this.httpService.post('https://survey.porsline.ir/api/surveys/'+ surveyId + '/responses/', undefined , this.headers))
    
        return Promise.all([questionReq, answerReq]);
    }

    getCharts(surveyId: number): Observable<any>{
        //TODO: move to httpService
        return this.httpService.get('https://survey.porsline.ir/api/surveys/'+ surveyId + '/charts/from/2000-10-10/to/2099-10-10/', this.headers).pipe(
            map(item => item.data)
            );
    }

    getSurveyInfo(surveyId: number): Observable<any>{
        return this.httpService.get<Survey>('https://survey.porsline.ir/api/surveys/'+ surveyId, this.headers).pipe(
            map(item => item.data)
            );  
    }

    async initializeSurvey(surveyId: number){
        const doesSurveyExist = await this.findSurveyInDb(surveyId);
        if (doesSurveyExist){
            throw new HttpException('SURVEY_INITIALIZATION.SURVEY_ALREADY_INITIALIZED', HttpStatus.FORBIDDEN);
        } else {
            return zip(
                this.getSurveyInfo(surveyId),
                this.getCharts(surveyId)).pipe(
                    map(data => ({...data[0], ...data[1]})),
                    catchError(error => {
                        throw new Error('SURVEY_INITIALIZATION.CANT_FETCH_SURVEY_INFO')
                    }), 
                    switchMap(mergedData => from(this.addSurveyToDb(mergedData)))
                )
        }
    }

    async findSurveyInDb(surveyId: number): Promise<Survey>{
        const response = await this.surveyRepository.findOne({id: +surveyId});
        if (!response) throw new HttpException('SURVEY.NOT_FOUND', HttpStatus.NOT_FOUND);
        return response;
    }

    }

    async getSurveyFromDb(surveyId: number): Promise<any>{
        const existsInDb = await this.findSurveyInDb(surveyId);
    }

    async addSurveyToDb(newSurvey: Survey): Promise<any>{
        return this.surveyRepository.save(newSurvey);
    }
}
