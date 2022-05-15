import { Controller, Get, HttpStatus } from '@nestjs/common';
import { SurveyService } from '../services/survey.service';

@Controller('survey')
export class SurveyController {

constructor(private service: SurveyService){};

@Get()
 async fetchSurveyData() {
    const response = await this.service.fetchSurveyDatafromApi(474423).catch(
        res => {
            return {
                success: false,
                message: res.response.status === HttpStatus.UNAUTHORIZED ? "کلید API خود را بررسی کنید" : "آیدی پرسشنامه وارد شده غیرمجاز است.",
                status: res.response.status,
                data: res.response.data
            }
        }
    )
    
    return {...response[0].data , ...response[1].data};
}

}
