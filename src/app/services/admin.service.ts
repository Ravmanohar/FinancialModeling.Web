import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { HttpClient } from '../index';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { AppConfig } from 'src/app/services/config.service';
import { AddClientModel, ClientModelDto, AddZoneModel } from 'src/app/models/add-client-model';
import { ExportReportDto } from '../components/financial-dashboard/financial-dashboard.component';

declare var $;
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl: string;
  private authUrl: string;
  constructor(
    private authService: AuthenticationService,
    private appConfig: AppConfig, private http: HttpClient) {

    this.apiUrl = this.appConfig.config.apiUrl;
    this.authUrl = this.appConfig.config.authUrl;

  }

  getUsers() {
    let users: any = [];
    users.push({ id: 1, userName: "User 1", email: "pss.shetty414@gmail.com", roleName: "User" });
    users.push({ id: 2, userName: "User 2", email: "pss.shetty414@gmail.com", roleName: "User" });
    users.push({ id: 3, userName: "User 3", email: "pss.shetty414@gmail.com", roleName: "User" });
    return observableOf(users);
  }

  setupClient(addClientModel: AddClientModel) {
    var apiPath = this.apiUrl + '/Admin/SetupClient';
    return this.http.post(apiPath, addClientModel);
  }

  updateClient(addClientModel: AddClientModel) {
    var apiPath = this.apiUrl + '/Admin/UpdateClient';
    return this.http.post(apiPath, addClientModel);
  }

  updateModelAvailability(clientModelDto: ClientModelDto) {
    var apiPath = this.apiUrl + '/Admin/UpdateModelAvailability';
    return this.http.post(apiPath, clientModelDto);
  }

  getClientById(clientId: number) {
    var apiPath = this.apiUrl + '/Admin/GetClientById?clientId=' + clientId;
    return this.http.get(apiPath);
  }

  getClientList() {
    let userId: string = this.authService.loggedInUser.userId;
    var apiPath = this.apiUrl + '/Admin/GetClientList';
    return this.http.get(apiPath);
  }

  getClientInfo(clientId: number) {
    var apiPath = this.apiUrl + '/Admin/GetClientInfo?clientId=' + clientId;
    return this.http.get(apiPath);
  }

  getFinancialDashboardJson() {
    var jsonFile = "assets/json/financial-dashboard.json";
    return this.http.get(jsonFile);
  }

  updateZoneOperatingDays(zone: AddZoneModel) {
    var apiPath = this.apiUrl + '/Admin/UpdateZoneOperatingDays';
    return this.http.post(apiPath, zone);
  }

  exportExcelReport(exportReportDto: ExportReportDto) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      var a;
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        // Trick for making downloadable link
        a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhttp.response);
        // Give filename you wish to download
        a.download = exportReportDto.financialDashboard.editClientModel.clientName + ".xlsx";
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
      }
    };
    // Post data to URL which handles post request
    var apiPath = this.apiUrl + '/Report/DownloadFiveYearExcelReport';
    // var apiPath = "http://localhost:57555/api/Report/DownloadFiveYearExcelReport";

    xhttp.open("POST", apiPath);
    xhttp.setRequestHeader("Content-Type", "application/json");
    // You should set responseType as blob for binary responses
    xhttp.responseType = 'blob';
    xhttp.send(JSON.stringify(exportReportDto));
  }

}
