import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom, merge} from 'rxjs';
import { Repository } from 'typeorm';
import { Survey } from '../entities/survey.entity';

@Injectable()
export class SurveyService {

    constructor(
        @InjectRepository(Survey)private readonly surveyRepository: Repository<Survey>,
         private httpService: HttpService){}

    async fetchSurveyDatafromApi(surveyId: number): Promise<any>{
        const questionReq = await firstValueFrom(this.httpService.get('https://survey.porsline.ir/api/surveys/'+ surveyId, {headers: {'Authorization': 'API-Key c0e852745ab0eea1727a21c98ebf093276a40253'}}))
        const answerReq = await firstValueFrom(this.httpService.post('https://survey.porsline.ir/api/surveys/'+ surveyId + '/responses/', undefined ,{headers: {'Authorization': 'API-Key c0e852745ab0eea1727a21c98ebf093276a40253'}}))
    
        return Promise.all([questionReq, answerReq]);
    }

    async getCharts(surveyId: number): Promise<any>{
        const req = await this.httpService.get(
            'https://survey.porsline.ir/api/surveys/'+ surveyId + '/charts/from/2000-10-10/to/2099-10-10/',
             {headers: {'Authorization': 'API-Key c0e852745ab0eea1727a21c98ebf093276a40253'}})
             return new Promise((resolve, reject)=>{
                req.subscribe(data => {
                    resolve(data.data);
                }, erorr => {
                    reject({
                        message: "Getting Survey chart data failed",
                    })
                })
             })
    }

    async getSurveyData(surveyId: number): Promise<any>{
        const existsInDb = await this.findSurvey(surveyId);
    }

    async addSurvey(newSurvey: SurveyType): Promise<any>{
        return this.surveyRepository.save(newSurvey);
    }

    async initializeSurvey(surveyId: number){
        const doesSurveyExist = await this.findSurvey(surveyId);
        return new Promise((resolve, reject) => {
        if (doesSurveyExist.length > 0){
            resolve({message: 'پرسشنامه ای با آیدی وارد شده وجود دارد', id: surveyId})
        } else {
            this.getCharts(surveyId).then( data => {
                this.addSurvey({_id: surveyId, ...data});
                resolve("Done")
            }
            )}
        })
    }

    async findSurvey(surveyId: number): Promise<any[]>{
        const req = await this.surveyRepository.find({_id: surveyId});
        return req;
    }
}
