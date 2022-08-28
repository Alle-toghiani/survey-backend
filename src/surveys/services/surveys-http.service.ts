import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, Observable } from 'rxjs';
import { FolderModel } from '../models/folder.model';
import { environment } from 'src/environments/environment';
import { Survey } from '../entities/survey.entity';
@Injectable()
export class SurveysHttpService {
    constructor(
        private http: HttpService
    ){}

    async getReportData(reportId: string){
        return new Promise(
          (resolve, reject) => {
            const url = environment.baseApiUrl + 'surveys/' + reportId + '/general-reports/';
            this.http.get(url).subscribe(
              {
                next: (reportsRes) => {
                    if (reportsRes.status === HttpStatus.OK){
                        resolve(reportsRes.data);
                    }
                    else reject(reportsRes.statusText)
                },
                error: (error) => {
                  reject(error)
                }
              }
            )
          }
        )
      }

  // get List of Surveys
  async getFolders(): Promise<any>{
    const url = environment.baseApiUrl + 'folders/';

    return await firstValueFrom(this.http.get(url, {params : {nested: true}}).pipe(map(item => item.data)));
  }

  // get List of Questions
  async getSurvey(surveyId: number): Promise<any>{
    const url = environment.baseApiUrl + 'surveys/'+ surveyId + '/detailedQuestions2/';

    return await firstValueFrom(this.http.get(url).pipe(map(item => ({...item.data, questions: item.data.questions.sort( (a,b) => a.order - b.order )}))));
  }

  // get List of Choices
  async getQuestion(surveydId:string, questionId: string): Promise<any>{
    return new Promise(
      (resolve, reject) => {
        const url = environment.baseApiUrl + 'surveys/' + surveydId + '/charts/from/2000-10-10/to/2099-10-10/';
        this.http.get(url).subscribe(
          {
            next: (questionsRes) => {
                if (questionsRes.status === HttpStatus.OK){
                  if (Object.values(questionsRes.data.data).length > 0){
                    const question = Object.values(questionsRes.data.data).find( (item: any) => item.id === +questionId);
                    if (question) resolve(question);
                    else reject("Question not found")
                  } 
                }
            },
            error: (error) => reject("Question not found")
          }
        )
      }
    )
  }
  
  async getQuestionsList(surveydId:string): Promise<any>{
    return new Promise(
      (resolve, reject) => {
        const url = environment.baseApiUrl + 'surveys/' + surveydId + '/charts/from/2000-10-10/to/2099-10-10/';
        this.http.get(url).subscribe(
          {
            next: (questionsRes) => {
                if (questionsRes.status === HttpStatus.OK){
                  resolve(Object.values(questionsRes.data.data))
                }
            },
            error: (error) => reject("Question List not found")
          }
        )
      }
    )
  }

  async initializeSurvey(body: {name: string, folder: number}): Promise<any>{
    const url = environment.baseApiUrl + 'surveys/';

    return await firstValueFrom(this.http.post(url, body));
  }

  async postQuestion(sid: string, data: any, path: string): Promise<any>{
    const url = environment.baseApiUrl + 'surveys/' + sid + '/questions/' + path + '/';
    const res = await firstValueFrom(this.http.post(url, data));
    return res.status;
  }

  async deleteQuestion(sid: string, qid: string): Promise<any>{
    const url = environment.baseApiUrl + 'surveys/' + sid + '/questions/' + qid + '/';
    const res = await firstValueFrom(this.http.delete(url));
    return res.status;
  }
}
