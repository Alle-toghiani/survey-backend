import { HttpService } from '@nestjs/axios';
import { Injectable , HttpStatus, HttpException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { firstValueFrom, Observable, from, zip, map, tap, switchMap, catchError} from 'rxjs';

import { SurveyQuestion } from '../entities/survey-question.entity';
import { Survey } from '../entities/survey.entity';
import { environment } from 'src/environments/environment';

@Injectable()
export class SurveyService {
    headers = {headers: {'Authorization': 'API-Key c0e852745ab0eea1727a21c98ebf093276a40253'}};

    constructor(
        @InjectRepository(Survey)private readonly surveyRepository: Repository<Survey>,
         private http: HttpService){}

    async fetchSurveyDatafromApi(surveyId: number): Promise<any>{
        const questionReq = await firstValueFrom(this.http.get(environment.baseApiUrl + 'surveys/'+ surveyId, this.headers))
        const answerReq = await firstValueFrom(this.http.post(environment.baseApiUrl + 'surveys/'+ surveyId + '/responses/', undefined , this.headers))
    
        return Promise.all([questionReq, answerReq]);
    }

    async fetchFoldersNested(): Promise<any>{
        const url = environment.baseApiUrl + 'folders/';
        return await firstValueFrom(this.http.get(url, {params : {nested: true}, headers: this.headers.headers }).pipe(map(item => item.data)));
    }

    getCharts(surveyId: number): Observable<any>{
        //TODO: move to http
        return this.http.get(environment.baseApiUrl + 'surveys/'+ surveyId + '/charts/from/2000-10-10/to/2099-10-10/', this.headers).pipe(
            map(chartRes => {
                let tempItem = {...chartRes.data};
                let dataArray = [];
                Object.keys(chartRes.data.data).forEach(dataObjectKey => {dataArray.push(chartRes.data.data[dataObjectKey])})
                tempItem.data = dataArray;
                return tempItem;
            })
            );
    }

    getSurveyInfo(surveyId: number): Observable<any>{
        return this.http.get<Survey>(environment.baseApiUrl + 'surveys/'+ surveyId, this.headers).pipe(
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

    async findSurveyQuestion(surveyId: string, questionId: string): Promise<SurveyQuestion>{
        //FIXME: get question object via query instead of getting the whole array and filtering it
        const response = await this.surveyRepository.findOne({select: ["data"], where:{id: +surveyId}})
        if (!response) throw new HttpException('SURVEY.NOT_FOUND', HttpStatus.NOT_FOUND);
            if ( response.data.length > 0 ){
                const question = response.data.find(item => item.id === +questionId);
                if (question){
                    return question;
                } else {
                    throw new HttpException('SURVEY.QUESTION.NOT_FOUND', HttpStatus.NOT_FOUND);
                }
            } else throw new HttpException('SURVEY.QUESTION.NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    async updateSurveyConfig(surveyId: string, questionId: string, data: any): Promise<boolean>{
        const survey = await this.findSurveyInDb(+surveyId);

        const updatedSurvey = {
            ...survey,
            data: survey.data.map(question => question.id === +questionId ? {...question, customChartSettings: data} : question)
        };
        const saveRes = this.surveyRepository.save(updatedSurvey);
        return !!saveRes;
    }

    async getSurveyFromDb(surveyId: number): Promise<any>{
        const existsInDb = await this.findSurveyInDb(surveyId);
    }

    async addSurveyToDb(newSurvey: Survey): Promise<any>{
        return this.surveyRepository.save(newSurvey);
    }
}
