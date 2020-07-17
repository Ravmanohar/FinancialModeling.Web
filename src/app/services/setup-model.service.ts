import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, AppConfig } from 'src/app/services';
import { SetupHourlyModelDto, SetupTimeOfDayModelDto } from 'src/app/models/setup.model.index';
import { SetupEscalatingModelDto } from '../models/setup-escalating-model';
import { LocationEquipmentCost, EquipmentCostLoader } from '../models/setup-equipment-cost.model';

declare var $;
declare var moment;

@Injectable({
    providedIn: 'root'
})
export class SetupModelService {

    private apiUrl: string;
    private authUrl: string;
    public equipmentCostLoader: EquipmentCostLoader = {
        loaderProperty: null,
        onStreetLoader: false,
        offStreetLoader: false,
        garagesLoader: false,
    };

    constructor(
        private authenticationService: AuthenticationService,
        private appConfig: AppConfig,
        private http: HttpClient) {

        this.apiUrl = this.appConfig.config.apiUrl;
        this.authUrl = this.appConfig.config.authUrl;
    }

    updateHourlyModel(setupHourlyModelDto: SetupHourlyModelDto) {
        var apiPath = this.apiUrl + '/admin/UpdateHourlyModel';
        return this.http.post(apiPath, setupHourlyModelDto);
    }

    updateTimeOfDayModel(setupTimeOfDayModelDto: SetupTimeOfDayModelDto) {
        var apiPath = this.apiUrl + '/admin/UpdateTimeOfDayModel';
        return this.http.post(apiPath, setupTimeOfDayModelDto);
    }

    updateEscalatingModel(setupEscalatingModelDto: SetupEscalatingModelDto) {
        var apiPath = this.apiUrl + '/admin/UpdateEscalatingModel';
        return this.http.post(apiPath, setupEscalatingModelDto);
    }

    updateEquipmentCost(locationEquipmentCost: LocationEquipmentCost) {
        var apiPath = this.apiUrl + '/admin/UpdateEquipmentCost';
        return this.http.post(apiPath, locationEquipmentCost);
    }

}
