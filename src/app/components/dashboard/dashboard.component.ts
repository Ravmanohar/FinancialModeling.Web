import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService, AuthenticationService } from 'src/app/services';
import { ParkingClientModel } from 'src/app/models/add-client-model';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectionService } from 'src/app/services/projection.service';
import { ProjectionModel } from 'src/app/models/projection.model';
import { FinancialDashboardService } from '../financial-dashboard/financial-dashboard.service';
import { FinancialDashboardDto } from 'src/app/models/setup.model.index';
import { DashboardService } from 'src/app/services/dashboard.service';
import { FinancialDashboardRevenueModel, ProfitInfo, DashboardEquipmentCostSummary } from '../financial-dashboard/financial-dashboard.models';
import { ProjectedEquipmentCostSummary } from 'src/app/models/common.models';

declare var $;
declare var toastr;
declare var Chart;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private router: Router,
    private adminService: AdminService,
    private projectionService: ProjectionService,
    public authService: AuthenticationService,
    private dashboardService: DashboardService,
    public financialDashboardService: FinancialDashboardService
  ) {

  }

  isShowLoader: boolean = false;
  clientList: Array<ParkingClientModel> = [];
  projectionsList: Array<ProjectionModel> = [];
  clientId: number = 0;
  projectionId: number = 0;

  ngOnInit() {
    // $(document).ready(() => {
    //   let onStreetRevenue: Array<number> = [400000, 200000, 100000, 200000, 200000];
    //   let offStreetRevenue: Array<number> = [800000, 300000, 100000, 200000, 200000];
    //   let garagesRevenue: Array<number> = [500000, 100000, 100000, 200000, 200000];
    //   this.renderFiveYearProjectionLineChart(onStreetRevenue, offStreetRevenue, garagesRevenue);

    //   this.renderRevenueChart("#RevenueChart", [500, 200, 300]);
    //   this.renderEquipmentCostChart("#EquipmentCostChart", [300, 50, 100]);
    //   this.renderOngoingFeesChart("#OngoingFeesChart", [600, 50, 100]);
    // });

    if (this.authService.loggedInUser.role == 'Admin') {
      this.getParkingClients();
    }
    else {
      this.clientId = this.authService.loggedInUser.clientId;
      this.clientList = [];
      this.getProjections(this.clientId);
    }
  }

  getParkingClients() {
    this.isShowLoader = true;
    this.adminService.getClientList()
      .subscribe((clients: Array<ParkingClientModel>) => {
        this.clientList = clients;
        this.isShowLoader = false;
      }, (errorResponse: HttpErrorResponse) => {
        this.clientList = [];
        this.isShowLoader = false;
      });
  }

  getProjections(clientId: number) {
    this.projectionService.getProjectionList(clientId)
      .subscribe((projections: Array<ProjectionModel>) => {
        this.projectionsList = projections;
        this.isShowLoader = false;
      }, (errorResponse: HttpErrorResponse) => {
        this.projectionsList = [];
        this.isShowLoader = false;
      });
  }

  onClientChange($event) {
    this.projectionId = 0;
    this.getProjections(this.clientId);
  }

  profitInfo: ProfitInfo = new ProfitInfo();
  dashboardEquipmentCostSummary: DashboardEquipmentCostSummary = new DashboardEquipmentCostSummary();
  financialDashboard: FinancialDashboardDto = new FinancialDashboardDto();
  onProjectionChange($event) {
    this.projectionService.getProjectionById(this.projectionId)
      .subscribe((projectionModel: ProjectionModel) => {
        this.financialDashboard = projectionModel.financialDashboard;
        // console.log(projectionModel.financialDashboard);

        // let projectedRevenueSummary: ProjectedRevenueSummary = this.businessService.getProjectedRevenueSummaryHourlyRateModel(this.financialDashboard.hourlyOnStreet);
        // console.log(projectedRevenueSummary)
        let financialDashboardRevenue: FinancialDashboardRevenueModel = new FinancialDashboardRevenueModel();
        financialDashboardRevenue = this.dashboardService.getYearlyFinancialDashboardRevenue(this.financialDashboard);
        console.log(financialDashboardRevenue);

        let modelProperties: Array<string> = ["hourlyRevenueModel", "timeOfDayRevenueModel", "escalatingRevenueModel"];
        let parkingProperties: Array<string> = ["onStreet", "offStreet", "garages"];

        let calcuateForYears: Array<number> = this.financialDashboardService.calcuateForYears;
        let totalRevenueAndCost: any = {};
        let fiveYearProjection: any = {};
        // console.log(financialDashboardRevenue);
        modelProperties.forEach(modelProp => {
          parkingProperties.forEach(parkingProp => {
            var totalSummary = financialDashboardRevenue[modelProp][parkingProp]["year1"].find(x => x.zoneName == "Total");
            if (totalRevenueAndCost[parkingProp] == null)
              totalRevenueAndCost[parkingProp] = { totalRevenue: 0, totalCost: 0 };
            totalRevenueAndCost[parkingProp].totalRevenue += totalSummary.peak.revenue + totalSummary.nonPeak.revenue;
            totalRevenueAndCost[parkingProp].totalCost += totalSummary.peak.cost + totalSummary.nonPeak.cost;

            calcuateForYears.forEach(year => {
              if (fiveYearProjection[parkingProp] == null)
                fiveYearProjection[parkingProp] = {};
              if (fiveYearProjection[parkingProp]["year" + year] == null)
                fiveYearProjection[parkingProp]["year" + year] = { totalRevenue: 0, totalCost: 0 };
              totalSummary = financialDashboardRevenue[modelProp][parkingProp]["year" + year].find(x => x.zoneName == "Total");
              fiveYearProjection[parkingProp]["year" + year].totalRevenue += totalSummary.peak.revenue + totalSummary.nonPeak.revenue;
              fiveYearProjection[parkingProp]["year" + year].totalCost += totalSummary.peak.cost + totalSummary.nonPeak.cost;
            });

          });
        });
        // console.log(totalRevenueAndCost);
        // console.log(fiveYearProjection);
        let revenueChartData: Array<number> = [];
        let equipmentCostChartData: Array<number> = [];
        let ongoingFeesChartData: Array<number> = [];

        this.profitInfo = new ProfitInfo();

        parkingProperties.forEach(parkingProp => {
          revenueChartData.push(totalRevenueAndCost[parkingProp].totalRevenue);
          equipmentCostChartData.push(totalRevenueAndCost[parkingProp].totalCost);

          this.profitInfo.annualRevenue += totalRevenueAndCost[parkingProp].totalRevenue;
        });
        this.dashboardEquipmentCostSummary = this.dashboardService.getDashboardEquipmentCostSummary(this.financialDashboard);
        this.profitInfo.equipmentBudget = this.dashboardEquipmentCostSummary.equipmentBudget;
        this.profitInfo.annualOperatingCost = this.dashboardEquipmentCostSummary.annualOperatingCost;

        ongoingFeesChartData.push(this.dashboardEquipmentCostSummary.onStreetZoneEquipmentSummary.estimatedCreditCardTransactionFees + this.dashboardEquipmentCostSummary.onStreetZoneEquipmentSummary.estimatedSoftwareFees);
        ongoingFeesChartData.push(this.dashboardEquipmentCostSummary.offStreetZoneEquipmentSummary.estimatedCreditCardTransactionFees + this.dashboardEquipmentCostSummary.offStreetZoneEquipmentSummary.estimatedSoftwareFees);
        ongoingFeesChartData.push(this.dashboardEquipmentCostSummary.garagesZoneEquipmentSummary.estimatedCreditCardTransactionFees + this.dashboardEquipmentCostSummary.garagesZoneEquipmentSummary.estimatedSoftwareFees);

        let onStreetRevenue: Array<number> = [];
        let offStreetRevenue: Array<number> = [];
        let garagesRevenue: Array<number> = [];
        calcuateForYears.forEach(year => {
          onStreetRevenue.push(fiveYearProjection["onStreet"]["year" + year].totalRevenue);
          offStreetRevenue.push(fiveYearProjection["offStreet"]["year" + year].totalRevenue);
          garagesRevenue.push(fiveYearProjection["garages"]["year" + year].totalRevenue);
        });
        // console.log(onStreetRevenue, offStreetRevenue, garagesRevenue);

        //Start : Set All values to zero
        if (!this.financialDashboard.hourlyOnStreet.isAvailable && !this.financialDashboard.timeOfDayOnStreet.isAvailable && !this.financialDashboard.escalatingOnStreet.isAvailable) {
          var resetOnStreetRevenue = [];
          onStreetRevenue.forEach(revenue => {
            resetOnStreetRevenue.push(0);
          });
          onStreetRevenue = resetOnStreetRevenue;

          revenueChartData[0] = 0;
          equipmentCostChartData[0] = 0;
          ongoingFeesChartData[0] = 0;
        }
        if (!this.financialDashboard.hourlyOffStreet.isAvailable && !this.financialDashboard.timeOfDayOffStreet.isAvailable && !this.financialDashboard.escalatingOffStreet.isAvailable) {
          var resetOffStreetRevenue = [];
          offStreetRevenue.forEach(revenue => {
            resetOffStreetRevenue.push(0);
          });
          offStreetRevenue = resetOffStreetRevenue;

          revenueChartData[1] = 0;
          equipmentCostChartData[1] = 0;
          ongoingFeesChartData[1] = 0;
        }
        if (!this.financialDashboard.hourlyGarages.isAvailable && !this.financialDashboard.timeOfDayGarages.isAvailable && !this.financialDashboard.escalatingGarages.isAvailable) {
          var resetGaragesRevenue = [];
          garagesRevenue.forEach(revenue => {
            resetGaragesRevenue.push(0);
          });
          garagesRevenue = resetGaragesRevenue;

          revenueChartData[2] = 0;
          equipmentCostChartData[2] = 0;
          ongoingFeesChartData[2] = 0;
        }
        //End : Set All values to zero

        this.renderFiveYearProjectionLineChart(onStreetRevenue, offStreetRevenue, garagesRevenue);

        // console.log(revenueChartData, equipmentCostChartData);
        this.renderRevenueChart("#RevenueChart", revenueChartData);
        this.renderEquipmentCostChart("#EquipmentCostChart", equipmentCostChartData);
        this.renderOngoingFeesChartData("#OngoingFeesChart", ongoingFeesChartData);

        this.isShowLoader = false;
      }, (errorResponse: HttpErrorResponse) => {
        toastr.error("Get Client Models", "Error");
      });
  }

  revenueChartContext: any = null;
  renderRevenueChart(elementId: string, data: any) {
    if (this.revenueChartContext != null)
      this.revenueChartContext.destroy();

    var ctxPie = $(elementId).get(0).getContext("2d");
    this.revenueChartContext = new Chart(ctxPie, {
      type: 'pie', data:
      {
        labels: ["OnStreet", "OffStreet", "Garages"],
        datasets: [
          {
            data: data,
            backgroundColor: ["#5b9bd5", "#1f3864", "#4472c4"]
          }
        ]
      }
      , options: { responsive: true }
    });
  }

  revenueOngoingFeesChartContext: any = null;
  renderOngoingFeesChart(elementId: string, data: any) {
    if (this.revenueOngoingFeesChartContext != null)
      this.revenueOngoingFeesChartContext.destroy();

    var ctxPie = $(elementId).get(0).getContext("2d");
    this.revenueOngoingFeesChartContext = new Chart(ctxPie, {
      type: 'pie', data:
      {
        labels: ["OnStreet", "OffStreet", "Garages"],
        datasets: [
          {
            data: data,
            backgroundColor: ["#5b9bd5", "#1f3864", "#4472c4"]
          }
        ]
      }
      , options: { responsive: true }
    });
  }

  equipmentCostChartContext: any = null;
  renderEquipmentCostChart(elementId: string, data: any) {
    if (this.equipmentCostChartContext != null)
      this.equipmentCostChartContext.destroy();

    var ctxPie = $(elementId).get(0).getContext("2d");
    this.equipmentCostChartContext = new Chart(ctxPie, {
      type: 'pie', data:
      {
        labels: ["OnStreet", "OffStreet", "Garages"],
        datasets: [
          {
            data: data,
            backgroundColor: ["#5b9bd5", "#1f3864", "#4472c4"]
          }
        ]
      }
      , options: { responsive: true }
    });
  }

  ongoingFeesChartContext: any = null;
  renderOngoingFeesChartData(elementId: string, data: any) {
    if (this.ongoingFeesChartContext != null)
      this.ongoingFeesChartContext.destroy();

    var ctxPie = $(elementId).get(0).getContext("2d");
    this.ongoingFeesChartContext = new Chart(ctxPie, {
      type: 'pie', data:
      {
        labels: ["OnStreet", "OffStreet", "Garages"],
        datasets: [
          {
            data: data,
            backgroundColor: ["#5b9bd5", "#1f3864", "#4472c4"]
          }
        ]
      }
      , options: { responsive: true }
    });
  }

  fiveYearProjectionLineChartContext: any = null;
  renderFiveYearProjectionLineChart(onStreetRevenue: Array<number>, offStreetRevenue: Array<number>, garagesRevenue: Array<number>) {
    if (this.fiveYearProjectionLineChartContext != null)
      this.fiveYearProjectionLineChartContext.destroy();

    var lineData = {
      labels: ["Year1", "Year2", "Year3", "Year4", "Year5"],
      datasets: [
        {
          label: "OnStreet",
          backgroundColor: '#5b9bd5',
          borderColor: '#5b9bd5',
          pointBorderColor: "#fff",
          data: onStreetRevenue,
          fill: false,
        },
        {
          label: "OffStreet",
          backgroundColor: '#1f3864',
          borderColor: '#1f3864',
          pointBorderColor: "#fff",
          data: offStreetRevenue,
          fill: false,
        },
        {
          label: "Garages",
          backgroundColor: '#4472c4',
          borderColor: '#4472c4',
          pointBorderColor: "#fff",
          data: garagesRevenue,
          fill: false,
        }
      ]
    };
    var lineOptions = {
      responsive: true,
    };
    var ctxLine = $("#fiveYearProjectionLineChart").get(0).getContext("2d");
    this.fiveYearProjectionLineChartContext = new Chart(ctxLine, { type: 'line', data: lineData, options: lineOptions });
  }

}