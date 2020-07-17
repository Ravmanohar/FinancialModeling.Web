import { Injectable } from '@angular/core';
import { AddClientModel } from 'src/app/models';
import { AuthenticationService, AppConfig } from 'src/app/services';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class SetupClientService {

    private apiUrl: string;
    private authUrl: string;
    constructor(
        private authenticationService: AuthenticationService,
        private appConfig: AppConfig,
        private http: HttpClient) {

        this.apiUrl = this.appConfig.config.apiUrl;
        this.authUrl = this.appConfig.config.authUrl;
    }

    addClient(addClientModel: AddClientModel) {
        var apiPath = this.apiUrl + '/admin/AddClient';
        return this.http.post(apiPath, addClientModel);
    }
}
