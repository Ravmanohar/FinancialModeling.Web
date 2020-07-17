import { Component, OnInit } from '@angular/core';
import { DashboardTab, TabList, FinancialDashboardDto, Tab, FinancialDashboardRevenueModel } from 'src/app/components/financial-dashboard/financial-dashboard.models';
import { FinancialDashboardService } from 'src/app/components/financial-dashboard/financial-dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService, AuthenticationService } from 'src/app/services';
import { ProjectionService } from 'src/app/services/projection.service';
import { ProjectionModel } from 'src/app/models/projection.model';
import { BusinessService } from 'src/app/services/business.service';
import { EditClientModel } from 'src/app/models/add-client-model';
import { ProjectedRevenueSummary, ProjectedEquipmentCostSummary } from 'src/app/models/common.models';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ParkingTypeEnum } from 'src/app/models/enums';

declare var $;
declare var toastr;

@Component({
  selector: 'app-financial-dashboard',
  templateUrl: './financial-dashboard.component.html',
  styleUrls: ['./financial-dashboard.component.scss']
})
export class FinancialDashboardComponent implements OnInit {

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    public adminService: AdminService,
    public projectionService: ProjectionService,
    public authService: AuthenticationService,
    private businessService: BusinessService,
    public dashboardService: DashboardService,
    public financialDashboardService: FinancialDashboardService) {
    this.activeRoute.params.subscribe(params => {
      if (params.projectionId)
        this.projectionId = params.projectionId;
    });
  }

  private onParentCommand: EventEmitter<string> = new EventEmitter();

  financialDashboardTabs: Array<DashboardTab> = [];

  activeTabName: string = "financialDashboard";
  financialDashboard: FinancialDashboardDto = new FinancialDashboardDto();
  clientInfo: EditClientModel = new EditClientModel();
  clientId: number = 0;
  ngOnInit() {
    // this.clientInfo = JSON.parse(localStorage.getItem('CurrentClient'));
    // console.log("clientInfo :", this.clientInfo);

    // this.addFinancialDashboardTabs();

    this.getFinancialDashboard();
  }

  projectionId: number = 0;
  clientOrProjectionName: string = "";
  getFinancialDashboard() {
    if (this.projectionId == 0) {
      this.getClientInfo();
    } else {
      let projection: ProjectionModel = JSON.parse(localStorage.getItem('Projection'));
      this.clientOrProjectionName = projection.projectionName;
      this.getProjectionInfo();
    }
  }

  isShowLoader: boolean = false;
  getClientInfo() {
    this.financialDashboardService.isFinancialDashboardLoaded = false;
    this.isShowLoader = true;
    this.clientId = 0;
    if (this.authService.loggedInUser.role == 'Admin') {
      this.clientInfo = JSON.parse(localStorage.getItem('CurrentClient'));
      this.clientId = this.clientInfo.clientId;
    }
    else {
      this.clientId = this.authService.loggedInUser.clientId;
    }
    this.adminService.getClientInfo(this.clientId)
      .subscribe((financialDashboard: FinancialDashboardDto) => {
        this.clientInfo = financialDashboard.editClientModel;
        this.clientOrProjectionName = this.clientInfo.clientName;

        this.financialDashboardService.isFinancialDashboardLoaded = true;
        console.log(financialDashboard);
        // this.financialDashboard = financialDashboard;
        this.setDashboardData(financialDashboard);
        this.isShowLoader = false;
      }, (errorResponse: HttpErrorResponse) => {
        this.financialDashboardService.isFinancialDashboardLoaded = true;
        toastr.error("Get Client Models", "Error");
      });
  }

  editedProjection: ProjectionModel = null;
  getProjectionInfo() {
    this.financialDashboardService.isFinancialDashboardLoaded = false;
    this.isShowLoader = true;
    this.projectionService.getProjectionById(this.projectionId)
      .subscribe((projectionModel: ProjectionModel) => {
        this.financialDashboardService.isFinancialDashboardLoaded = true;
        console.log(projectionModel.financialDashboard);
        this.editedProjection = projectionModel;
        this.setDashboardData(projectionModel.financialDashboard);
        this.isShowLoader = false;
      }, (errorResponse: HttpErrorResponse) => {
        this.financialDashboardService.isFinancialDashboardLoaded = true;
        toastr.error("Get Client Models", "Error");
      });
  }

  setDashboardData(financialDashboard: FinancialDashboardDto) {
    this.financialDashboard = financialDashboard;
    this.businessService.setGlobals(this.financialDashboard);
    this.addFinancialDashboardTabs();
  }

  addFinancialDashboardTabs() {
    let costTabsProperties: Array<string> = ["onStreetEquipmentCost", "offStreetEquipmentCost", "garagesEquipmentCost"];
    let tabList: TabList = new TabList();
    for (var tab of tabList.financialDashboardTabs) {
      let dashboardTab: DashboardTab = new DashboardTab();
      dashboardTab.tabId = tab.id;
      dashboardTab.tabName = tab.name;
      dashboardTab.tabCode = tab.property;
      if (tab.showAlways)
        dashboardTab.isAvailable = true;
      else {
        if (costTabsProperties.indexOf(tab.property) >= 0) {
          let isAvailable: boolean = false;
          switch (tab.property) {
            case "onStreetEquipmentCost":
              isAvailable = this.financialDashboard.hourlyOnStreet.isAvailable || this.financialDashboard.timeOfDayOnStreet.isAvailable || this.financialDashboard.escalatingOnStreet.isAvailable;
              break;
            case "offStreetEquipmentCost":
              isAvailable = this.financialDashboard.hourlyOffStreet.isAvailable || this.financialDashboard.timeOfDayOffStreet.isAvailable || this.financialDashboard.escalatingOffStreet.isAvailable;
              break;
            case "garagesEquipmentCost":
              isAvailable = this.financialDashboard.hourlyGarages.isAvailable || this.financialDashboard.timeOfDayGarages.isAvailable || this.financialDashboard.escalatingGarages.isAvailable;
              break;
          }
          dashboardTab.isAvailable = isAvailable;
        } else {
          dashboardTab.isAvailable = this.financialDashboard[tab.property].isAvailable;
        }
      }
      if (dashboardTab.isAvailable)
        this.financialDashboardTabs.push(dashboardTab);
    }
    console.log(this.financialDashboardTabs);
  }

  onTabChange(tab: DashboardTab) {
    this.activeTabName = tab.tabCode;
    console.log(this.activeTabName);
  }

  onBackToProjections() {
    if (this.authService.loggedInUser.role == 'Admin')
      this.router.navigate(['manage-client']);
    else
      this.router.navigate(['projections']);
  }

  tabPosition: any = {
    start: 0,
    end: 7,
    size: 7
  };
  onArrowNavigation(direction: string) {
    var max = this.financialDashboardTabs.length;
    var min = 0, prev = 0, next = 0, start = 0, end = 0;
    switch (direction) {
      case 'left':
        var prev = this.tabPosition.start - this.tabPosition.size;
        start = prev < min ? min : prev;
        this.tabPosition.start = start;
        this.tabPosition.end = this.tabPosition.start + this.tabPosition.size;
        break;
      case 'right':
        next = this.tabPosition.end + this.tabPosition.size;
        end = next > max ? max : next;
        this.tabPosition.end = end;
        this.tabPosition.start = this.tabPosition.end - this.tabPosition.size;
        break;
      default:
        break;
    }
  }

  onChildAction($event) {
    console.log("onChildAction", $event);
  }

  onShowSaveProjectionPopup() {
    $("#saveas-model-popup").modal('show');
  }

  projectionName: string = "";
  onSaveAsProjection() {
    this.isShowLoader = true;

    // let clientInfo = JSON.parse(localStorage.getItem('CurrentClient'));
    let projectionModel: ProjectionModel = new ProjectionModel();
    projectionModel.projectionName = this.projectionName;
    projectionModel.clientId = this.clientId;
    projectionModel.userId = this.authService.loggedInUser.userId;
    projectionModel.createdById = this.authService.loggedInUser.userId;
    projectionModel.financialDashboard = this.financialDashboard;

    this.projectionService.createProjection(projectionModel)
      .subscribe((projection: ProjectionModel) => {
        console.log(projection);
        toastr.success("Projection Saved Successfully.", "Success");
        $("#saveas-model-popup").modal('hide');
        this.isShowLoader = false;
        toastr.info("Opening Projection.", "Info");
        localStorage.setItem('Projection', JSON.stringify(projection));
        this.router.navigate(['/financial-dashboard', projection.projectionId]);
      }, (errorResponse: HttpErrorResponse) => {
        this.isShowLoader = false;
        toastr.error("Failed to Save Projection.", "Error");
      });
  }

  onUpdateProjection() {
    this.isShowLoader = true;
    this.editedProjection.modifiedById = this.authService.loggedInUser.userId;
    this.editedProjection.financialDashboard = this.financialDashboard;
    this.projectionService.updateProjection(this.editedProjection)
      .subscribe((projectionModel: ProjectionModel) => {
        toastr.success("Projection Updated Successfully.", "Success");
        this.isShowLoader = false;
        // this.editedProjection = projectionModel;
      }, (errorResponse: HttpErrorResponse) => {
        this.isShowLoader = false;
        toastr.error("Failed to Update Projection.", "Error");
      });
  }

  // Start : Download Excel Report Code
  onDownloadReport() {
    // this.adminService.getFinancialDashboardJson()
    //   .subscribe((financialDashboard: FinancialDashboardDto) => {
    let financialDashboard: FinancialDashboardDto = this.financialDashboard;
    console.log(financialDashboard);
    let revenueProperties: Array<string> = [
      "hourlyOnStreet", "hourlyOffStreet", "hourlyGarages",
      "timeOfDayOnStreet", "timeOfDayOffStreet", "timeOfDayGarages",
      "escalatingOnStreet", "escalatingOffStreet", "escalatingGarages",
    ];
    let costProperties: Array<string> = ["onStreetEquipmentCost", "offStreetEquipmentCost", "garagesEquipmentCost"];
    let tabList: TabList = new TabList();
    let tab: Tab = null;

    let exportReportDto: ExportReportDto = new ExportReportDto();
    exportReportDto.financialDashboard = financialDashboard;

    exportReportDto.financialDashboardRevenue = this.dashboardService.getYearlyFinancialDashboardRevenue(financialDashboard);
    revenueProperties.forEach((revenueProperty: string) => {
      let projectedRevenueSummary: ProjectedRevenueSummary = new ProjectedRevenueSummary();
      tab = tabList.financialDashboardTabs.find(x => x.property == revenueProperty);
      switch (revenueProperty) {
        case "hourlyOnStreet":
        case "hourlyOffStreet":
        case "hourlyGarages":
          projectedRevenueSummary = this.businessService.getProjectedRevenueSummaryHourlyRateModel(financialDashboard[revenueProperty]);
          break;
        case "timeOfDayOnStreet":
        case "timeOfDayOffStreet":
        case "timeOfDayGarages":
          projectedRevenueSummary = this.businessService.getProjectedRevenueSummaryTimeOfDayRateModel(financialDashboard[revenueProperty]);
          break;
        case "escalatingOnStreet":
        case "escalatingOffStreet":
        case "escalatingGarages":
          projectedRevenueSummary = this.businessService.getProjectedRevenueSummaryEscalatingRateModel(financialDashboard[revenueProperty]);
          break;
      }
      projectedRevenueSummary.reportHeader = tab.name;
      projectedRevenueSummary.reportName = tab.name;
      projectedRevenueSummary.isAvailable = financialDashboard[revenueProperty].isAvailable;
      projectedRevenueSummary.parkingTypeId = financialDashboard[revenueProperty].parkingTypeId;
      exportReportDto.projectedRevenueSummaries.push(projectedRevenueSummary);
    });

    costProperties.forEach((costProperty: string) => {
      let projectedEquipmentCostSummary: ProjectedEquipmentCostSummary = new ProjectedEquipmentCostSummary();
      switch (costProperty) {
        case "onStreetEquipmentCost":
          projectedEquipmentCostSummary = this.businessService.getProjectedEquipmentCostSummary(financialDashboard.onStreetEquipmentCost, "OnStreet");
          projectedEquipmentCostSummary.isAvailable = exportReportDto.projectedRevenueSummaries.find(x => x.parkingTypeId == ParkingTypeEnum.OnStreet && x.isAvailable) != null;
          projectedEquipmentCostSummary.reportName = "Equipment Cost On Street";
          projectedEquipmentCostSummary.reportHeader = "Equipment Cost Summary On Street";
          break;
        case "offStreetEquipmentCost":
          projectedEquipmentCostSummary = this.businessService.getProjectedEquipmentCostSummary(financialDashboard.offStreetEquipmentCost, "OffStreet");
          projectedEquipmentCostSummary.isAvailable = exportReportDto.projectedRevenueSummaries.find(x => x.parkingTypeId == ParkingTypeEnum.OffStreet && x.isAvailable) != null;
          projectedEquipmentCostSummary.reportName = "Equipment Cost Off Street";
          projectedEquipmentCostSummary.reportHeader = "Equipment Cost Summary Off Street";
          break;
        case "garagesEquipmentCost":
          projectedEquipmentCostSummary = this.businessService.getProjectedEquipmentCostSummary(financialDashboard.garagesEquipmentCost, "Garages");
          projectedEquipmentCostSummary.isAvailable = exportReportDto.projectedRevenueSummaries.find(x => x.parkingTypeId == ParkingTypeEnum.Garages && x.isAvailable) != null;
          projectedEquipmentCostSummary.reportName = "Equipment Cost Garages";
          projectedEquipmentCostSummary.reportHeader = "Equipment Cost Summary Garages";
          break;
      }
      exportReportDto.projectedEquipmentCostSummaries.push(projectedEquipmentCostSummary);
    });

    this.adminService.exportExcelReport(exportReportDto);
  }
  // End : Download Excel Report Code

}

export class ExportReportDto {
  financialDashboard: FinancialDashboardDto = new FinancialDashboardDto();

  financialDashboardRevenue: FinancialDashboardRevenueModel = new FinancialDashboardRevenueModel();
  projectedRevenueSummaries: Array<ProjectedRevenueSummary> = new Array<ProjectedRevenueSummary>();
  projectedEquipmentCostSummaries: Array<ProjectedEquipmentCostSummary> = new Array<ProjectedEquipmentCostSummary>();
}