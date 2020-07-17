import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService, AuthenticationService } from 'src/app/services';
import { HttpErrorResponse } from '@angular/common/http';
import { ParkingClientModel } from 'src/app/models/add-client-model';
import { BusinessService } from 'src/app/services/business.service';
import { DashboardService } from 'src/app/services/dashboard.service';

declare var toastr;
@Component({
  selector: 'app-view-clients',
  templateUrl: './view-clients.component.html',
  styleUrls: ['./view-clients.component.scss']
})
export class ViewClientsComponent implements OnInit {

  constructor(
    private router: Router,
    private adminService: AdminService,
    public authService: AuthenticationService,
    public businessService: BusinessService,
    public dashboardService: DashboardService,
  ) { }

  clientList: Array<ParkingClientModel> = [];
  ngOnInit() {
    this.getParkingClients();
  }

  isShowLoader: boolean = false;
  getParkingClients() {
    this.isShowLoader = true;
    this.adminService.getClientList()
      .subscribe((clients: Array<ParkingClientModel>) => {
        this.clientList = clients;
        this.isShowLoader = false;
      }, (errorResponse: HttpErrorResponse) => {
        this.isShowLoader = false;
        toastr.error("Failed to get clients, please try again!", "Error");
      });
  }

  viewClientDetails(client: ParkingClientModel) {
    localStorage.setItem('CurrentClient', JSON.stringify(client));
    this.router.navigate(['manage-client']);
  }

  onClientCreated(newClient: ParkingClientModel) {
    this.clientList.push(newClient);
  }

  searchText: string = '';
  isAscendingOrder: boolean = null;
  columnName: string = null;
  onSortOrderChange() {
    this.columnName = 'clientName';
    this.isAscendingOrder = !this.isAscendingOrder;
    console.log(this.isAscendingOrder);
  }
}