import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, AppConfig } from 'src/app/services';
import { SetupHourlyModelDto, SetupTimeOfDayModelDto, FinancialDashboardDto } from 'src/app/models/setup.model.index';
import { SetupEscalatingModelDto } from '../models/setup-escalating-model';
import { LocationEquipmentCost } from '../models/setup-equipment-cost.model';
import { ProjectionModel } from '../models/projection.model';

declare var $;
declare var moment;
@Injectable({
  providedIn: 'root'
})
export class ProjectionService {

  private apiUrl: string;
  private authUrl: string;

  constructor(
    private authenticationService: AuthenticationService,
    private appConfig: AppConfig,
    private http: HttpClient) {

    this.apiUrl = this.appConfig.config.apiUrl;
    this.authUrl = this.appConfig.config.authUrl;
  }

  createProjection(projectionModel: ProjectionModel) {
    var apiPath = this.apiUrl + '/Projection/CreateProjection';
    return this.http.post(apiPath, projectionModel);
  }

  updateProjection(projectionModel: ProjectionModel) {
    var apiPath = this.apiUrl + '/Projection/UpdateProjection';
    return this.http.post(apiPath, projectionModel);
  }

  deleteProjection(projectionId: number) {
    var apiPath = this.apiUrl + '/Projection/DeleteProjection?projectionId=' + projectionId;
    return this.http.post(apiPath, null);
  }

  getProjectionList(clientId: number) {
    var apiPath = this.apiUrl + '/Projection/GetProjectionList?clientId=' + clientId;
    return this.http.get(apiPath);
  }

  getProjectionById(projectionId: number) {
    var apiPath = this.apiUrl + '/Projection/GetProjectionById?projectionId=' + projectionId;
    return this.http.get(apiPath);
  }

}
