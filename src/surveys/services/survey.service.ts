import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, merge} from 'rxjs';

@Injectable()
export class SurveyService {

    constructor(private httpService: HttpService){}

    async fetchSurveyDatafromApi(surveyId: number): Promise<any>{
        const questionReq = await firstValueFrom(this.httpService.get('https://survey.porsline.ir/api/surveys/'+ surveyId, {headers: {'Authorization': 'API-Key c0e852745ab0eea1727a21c98ebf093276a40253'}}))
        const answerReq = await firstValueFrom(this.httpService.post('https://survey.porsline.ir/api/surveys/'+ surveyId + '/responses/', undefined ,{headers: {'Authorization': 'API-Key c0e852745ab0eea1727a21c98ebf093276a40253'}}))
    
        return Promise.all([questionReq, answerReq]);
    }
}
