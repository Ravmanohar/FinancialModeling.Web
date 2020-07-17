import { Component, OnInit } from '@angular/core';
import { LookupService, AdminService } from '../../services';
import { Router } from '@angular/router';
import { ParkingClientModel } from 'src/app/models/add-client-model';
import { RouterExtensionService } from 'src/app/services/common/router-extension-service';

declare var $;
@Component({
  selector: 'app-manage-client',
  templateUrl: './manage-client.component.html',
  styleUrls: ['./manage-client.component.scss']
})
export class ManageClientComponent implements OnInit {

  constructor(
    private router: Router,
    public routerExtensionService: RouterExtensionService) { }

  currentClient: ParkingClientModel = null;
  ngOnInit() {
    this.currentClient = JSON.parse(localStorage.getItem('CurrentClient'));
    console.log(this.currentClient);

    let previousUrl: string = this.routerExtensionService.getPreviousUrl();
    if (previousUrl.indexOf('/financial-dashboard') >= 0)
      this.activeTabName = 'projections-tab';
  }

  activeTabName: string = "setup-model-tab";// "projections-tab";
  onTabChange(tabName: string) {
    this.activeTabName = tabName;
  }

  onModelCreated(tabName: string) {
    this.activeTabName = tabName;
  }

  goToViewClient() {
    this.router.navigate(['view-clients']);
  }

}
