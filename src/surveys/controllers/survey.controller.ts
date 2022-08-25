import { Body, Controller, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { SurveyService } from '../services/survey.service';
import { CreateSurvey } from '../dtos/survey.dto';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { Public } from 'src/common/decorators/public-route.decorator';
import { SurveysHttpService } from '../services/surveys-http.service';

@Controller('survey')
export class SurveyController {

    constructor(
        private surveyService: SurveyService,
        private surveyHttpService: SurveysHttpService
        ){};

    @Get('/folders')
        async getFoldersNested() {
            try{
                const response = await this.surveyService.fetchFoldersNested();
                return new ResponseSuccess("FOLDERS.FETCH.SUCCESS", response);
            }
            catch(error) {
                return new ResponseError("FOLDERS.FETCH.ERROR", error)
            }
        }

    @Get('/:sid/details/:qid')
        async getSurveyQuestionDetails(@Param('sid') sid: string, @Param('qid') qid: string){
            try{
                var response =  await this.surveyService.findSurveyQuestion(sid, qid);
                return new ResponseSuccess("SURVEY.QUESTION.GET.SUCCESS", response);
                
            }
            catch(error) {
                return new ResponseError("SURVEY.QUESTION.GET.ERROR", error)
            }
        }

    @Put('/:sid/details/:qid')
        async updateChartConfig(@Param('sid') sid: string, @Param('qid') qid: string, @Body() data: any){
            try{
                var response =  await this.surveyService.updateSurveyConfig(sid, qid, data);
                return new ResponseSuccess("CHART-CONFIG.UPDATE.SUCCESS", response);
                
            }
            catch(error) {
                return new ResponseError("CHART-CONFIG.UPDATE.ERROR", error)
            }
        }    

    @Get('/:sid')
        async getSurveyData(@Param('sid') sid: number){
            try{
                var response =  await this.surveyService.findSurveyInDb(sid);
                return new ResponseSuccess("SURVEY.GET.SUCCESS", response)
            }
            catch(error) {
                return new ResponseError("SURVEY.GET.ERROR", error)
            }
        }

    @Post('/initialize/:sid')
        initializeSurvey(@Param('sid') id){
            return this.surveyService.initializeSurvey(id);
        }

    @Post('/get-charts/:sid')
        getCharts(@Param('sid') id){
            return this.surveyService.getCharts(id);
        }

    @Public()
    @Get('/r/:reportId')
        async getReports(@Param('reportId') reportId) {
            try{
                
                const response = await this.surveyHttpService.getReportData(reportId);
                return new ResponseSuccess("SURVEY.GET.SUCCESS", response)
            }
            catch(error) {
                return new ResponseError("SURVEY.GET.ERROR", error)
            }
        }
}
