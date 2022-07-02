import { HttpService } from '@nestjs/axios';
import { Injectable , HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom, merge, Observable, from} from 'rxjs';
import { Repository } from 'typeorm';
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
        return this.httpService.get('https://survey.porsline.ir/api/surveys/'+ surveyId + '/charts/from/2000-10-10/to/2099-10-10/', this.headers);
    }


    async initializeSurvey(surveyId: number){
        const doesSurveyExist = await this.findSurveyInDb(surveyId);
        return new Promise((resolve, reject) => {
        if (doesSurveyExist.id){
            resolve({message: 'پرسشنامه ای با آیدی وارد شده وجود دارد', id: surveyId})
        } else {
            let surveyObject = {} as Survey;
            this.getSurveyInfo(surveyId).then(
                (res) => {
                    surveyObject = res;
                    return this.getCharts(surveyId)
                }
            ).then( (chartData) => {
                surveyObject.data = chartData;
                return this.addSurveyToDb(surveyObject);
            }).then(
                (res) => {
                    resolve({
                        success: true,
                        id: surveyId,
                        message: "اطلاعات پرسشنامه با موفقیت دریافت شد"
                    });
                }
            ).catch((data) => {
                reject(
                    {
                    success: false,
                    id: surveyId,
                    message: "خواندن اطلاعات پرسشنامه با خطا مواجه شد",
                    status: data.status
                })
            })
        }
        })
    getSurveyInfo(surveyId: number): Observable<any>{
        return this.httpService.get<Survey>('https://survey.porsline.ir/api/surveys/'+ surveyId, this.headers);  
    }


    async findSurveyInDb(surveyId: number): Promise<Survey>{
        return await this.surveyRepository.findOne({id: +surveyId});
    }

    async getSurveyFromDb(surveyId: number): Promise<any>{
        const existsInDb = await this.findSurveyInDb(surveyId);
    }

    async addSurveyToDb(newSurvey: Survey): Promise<any>{
        return this.surveyRepository.save(newSurvey);
    }
}
