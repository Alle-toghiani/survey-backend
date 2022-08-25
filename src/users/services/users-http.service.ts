import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { environment } from 'src/environments/environment';

import { FolderModel } from 'src/surveys/models/folder.model';
@Injectable()
export class UsersHttpService {

    constructor(
        private http: HttpService
    ){}

    getFolders(apiToken: string){
        const url = environment.baseApiUrl + 'folders';
        const header = {'Authorization' : apiToken };
        return this.http.get<FolderModel[]>(url, {headers: header});
    }
}
