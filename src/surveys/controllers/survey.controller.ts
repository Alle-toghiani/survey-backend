import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { SurveyService } from '../services/survey.service';
import { CreateSurvey } from '../dtos/survey.dto';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';

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

@Get('/:sid/details/:qid')
    async getSurveyQuestionDetails(@Param('sid') sid: string, @Param('qid') qid: string){
        try{
            var response =  await this.service.findSurveyQuestion(sid, qid);
            return new ResponseSuccess("SURVEY.QUESTION.GET.SUCCESS", response);
            
        }
        catch(error) {
            return new ResponseError("SURVEY.QUESTION.GET.ERROR", error)
        }
    }

@Get('/:sid')
    async getSurveyData(@Param('sid') sid: number){
        try{
            var response =  await this.service.findSurveyInDb(sid);
            return new ResponseSuccess("SURVEY.GET.SUCCESS", response)
        }
        catch(error) {
            return new ResponseError("SURVEY.GET.ERROR", error)
        }
    }

@Post('/initialize/:sid')
    initializeSurvey(@Param('sid') id){
        return this.service.initializeSurvey(id);
    }

@Post('/get-charts/:sid')
getCharts(@Param('sid') id){
    return this.service.getCharts(id);
}
}
