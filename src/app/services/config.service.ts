import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfigModel } from '../models';

declare var $;
declare var appConfig;

@Injectable({
    providedIn: 'root'
})
export class AppConfig {

    constructor(private http: HttpClient
        // , private authService: AuthenticationService
    ) {
        this.config = appConfig;
    }

    config: AppConfigModel;

    getConfigs() {
        return this.config;
    }

    getApiPath(controllerName: string, methodName: string, params: any = []) {
        var queryString = '';
        if (params.length > 0)
            queryString = params.join('/');
        return `${this.config.apiUrl}/${controllerName}/${methodName}/${queryString}`;
    }

}
