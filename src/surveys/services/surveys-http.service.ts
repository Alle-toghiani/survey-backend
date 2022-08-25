import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { FolderModel } from '../models/folder.model';
import { environment } from 'src/environments/environment';
@Injectable()
export class SurveysHttpService {
    constructor(
        private http: HttpService
    ){}

    
}
