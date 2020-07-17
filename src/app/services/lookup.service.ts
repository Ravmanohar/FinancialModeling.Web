import { Injectable } from '@angular/core';
import { HttpClient } from '../index';
import { AppConfig } from 'src/app/services/config.service';
import { forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
// import { ParkingType, ModelType } from 'src/app/models/setup-model';

@Injectable({ providedIn: 'root' })
export class LookupService {

  constructor(private appConfig: AppConfig, private http: HttpClient) {
    this.getLookups();
    this.getAllLookups();
    this.getTimeSlots();
  }

  lookup: Lookup = {
    parkingTypes: [],
    modelTypes: [],
    userRoles: [],
    timeSlots: []
  };

  propertyNames: Array<string> = [
    "hourlyOnStreet",
    "timeOfDayOnStreet",
    "escalatingOnStreet",
    "hourlyOffStreet",
    "timeOfDayOffStreet",
    "escalatingOffStreet",
    "hourlyGarages",
    "timeOfDayGarages",
    "escalatingGarages"
  ];

  modelTypeLables: any = {
    "hourlyOnStreet": "Hourly - On-Street",
    "timeOfDayOnStreet": "Time Of Day - On-Street",
    "escalatingOnStreet": "Escalating - On-Street",
    "hourlyOffStreet": "Hourly - Off-Street",
    "timeOfDayOffStreet": "Time Of Day - Off-Street",
    "escalatingOffStreet": "Escalating - Off-Street",
    "hourlyGarages": "Hourly Garages",
    "timeOfDayGarages": "Time Of Day - Garages",
    "escalatingGarages": "Escalating - Garages",
  };

  parkingTypes: Array<string> = ["onStreet", "offStreet", "garages"];

  getTimeSlots() {
    this.lookup.timeSlots = [];
    var periods = ['AM', 'PM']
      , hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
      , prop = null
      , hour = null
      , min = null;

    for (prop in periods) {
      for (hour in hours) {
        for (min = 0; min < 60; min += 15) {
          this.lookup.timeSlots.push(('0' + hours[hour]).slice(-2) + ':' + ('0' + min).slice(-2) + " " + periods[prop]);
        }
      }
    }
    return this.lookup.timeSlots;
  }

  getLookups() {
    this.getModelTypes()
      .subscribe((modelTypes: any) => {
        this.lookup.modelTypes = modelTypes;
      }, (errorResponse: HttpErrorResponse) => { });
    this.getParkingTypes()
      .subscribe((parkingTypes: any) => {
        this.lookup.parkingTypes = parkingTypes;
      }, (errorResponse: HttpErrorResponse) => { });
  }

  getModelTypes() {
    var apiPath = this.appConfig.config.apiUrl + "/Lookup/GetLuModelTypes"
    return this.http.get(apiPath);
  }

  getParkingTypes() {
    var apiPath = this.appConfig.config.apiUrl + "/Lookup/GetLuParkingTypes"
    return this.http.get(apiPath);
  }

  getRoles() {
    return this.lookup.userRoles = [
      { roleId: 1, roleName: "Admin" },
      { roleId: 2, roleName: "User" },
    ];
  }

  getAllLookups() {
    this.lookup.parkingTypes = [
      { parkingTypeId: 1, parkingTypeName: "On Street" },
      { parkingTypeId: 2, parkingTypeName: "Off Street" },
      { parkingTypeId: 3, parkingTypeName: "Garage" },
    ];
    this.lookup.modelTypes = [
      { modelTypeId: 1, modelTypeName: "Hourly" },
      { modelTypeId: 2, modelTypeName: "Time of day" },
      { modelTypeId: 3, modelTypeName: "Escalating" },
    ];
    return this.lookup;
  }
}

export class Lookup {
  parkingTypes: any = [];
  modelTypes: any = [];
  userRoles: any = [];
  timeSlots: Array<string> = [];
}