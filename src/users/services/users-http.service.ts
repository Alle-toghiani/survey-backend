import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { FolderModel } from 'src/surveys/models/folder.model';
@Injectable()
export class UsersHttpService {

    constructor(
        private http: HttpService
    ){}

    getFolders(apiToken: string): any{
        const url = environment.baseApiUrl + 'folders';
        const header = {'Authorization' : apiToken };
        return firstValueFrom(this.http.get<FolderModel[]>(url, {headers: header}));
    }
}
