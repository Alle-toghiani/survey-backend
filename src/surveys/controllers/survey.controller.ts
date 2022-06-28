import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { SurveyService } from '../services/survey.service';
import { CreateSurvey } from '../dtos/survey.dto';
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

@Get('/:id')
    async getSurveyData(@Param('id') id: number){
        return this.service.findSurveyInDb(id);
    }

@Post('/initialize/:id')
    initializeSurvey(@Param('id') id){
        return this.service.initializeSurvey(id);
    }

@Post('/get-charts/:id')
getCharts(@Param('id') id){
    return this.service.getCharts(id);
}
}
