import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { FinancialDashboardRevenueModel, RevenueModel, ZoneRevenue, ZoneRevenueSummary, FinancialDashboardDto } from '../financial-dashboard.models';
import { FinancialDashboardService } from '../financial-dashboard.service';
import { BusinessService } from 'src/app/services/business.service';
import { ProjectedRevenueSummary, ZoneSummary, ProjectedEquipmentCostSummary, ZoneEquipmentSummary } from 'src/app/models/common.models';
import { ParkingTypeEnum, ModelTypeEnum } from 'src/app/models/enums';
import { SetupHourlyModelDto, SetupTimeOfDayModelDto } from 'src/app/models/setup.model.index';
import { SetupEscalatingModelDto } from 'src/app/models/setup-escalating-model';
import { LocationEquipmentCost } from 'src/app/models/setup-equipment-cost.model';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainDashboardComponent implements OnInit {
  @Input() private onParentCommand: EventEmitter<string>;
  @Input() public financialDashboard: FinancialDashboardDto;

  constructor(
    public financialDashboardService: FinancialDashboardService,
    private dashboardService: DashboardService,
    private businessService: BusinessService) {

  }
  isShowLoader: boolean = false;
  financialDashboardRevenue: FinancialDashboardRevenueModel = new FinancialDashboardRevenueModel();

  modelTypes: any = [
    { name: "hourlyRevenueModel", displayName: "HOURLY RATE", modelName: "HOURLY" },
    { name: "timeOfDayRevenueModel", displayName: "TIME OF DAY RATE", modelName: "TIMEOFDAY" },
    { name: "escalatingRevenueModel", displayName: "ESCALATING RATE", modelName: "ESCALATING" },
  ];
  peakNonPeakColumns: Array<string> = ['nonPeak', 'peak'];
  locationNames: Array<string> = ['onStreet', 'offStreet', 'garages'];
  ngOnInit() {
    this.peakNonPeakColumns = ['nonPeak', 'peak'];
    if (this.financialDashboard.editClientModel.isPeakSeasonPricing == false)
      this.peakNonPeakColumns = ['nonPeak'];

    // this.financialDashboardRevenue.hourlyRevenueModel = new RevenueModel();

    // this.financialDashboardRevenue.hourlyRevenueModel.onStreet = this.getYearlyRevenueModel(ParkingTypeEnum.OnStreet, ModelTypeEnum.Hourly);
    // this.financialDashboardRevenue.hourlyRevenueModel.offStreet = this.getYearlyRevenueModel(ParkingTypeEnum.OffStreet, ModelTypeEnum.Hourly);
    // this.financialDashboardRevenue.hourlyRevenueModel.garages = this.getYearlyRevenueModel(ParkingTypeEnum.Garages, ModelTypeEnum.Hourly);

    // this.financialDashboardRevenue.timeOfDayRevenueModel.onStreet = this.getYearlyRevenueModel(ParkingTypeEnum.OnStreet, ModelTypeEnum.TimeOfDay);
    // this.financialDashboardRevenue.timeOfDayRevenueModel.offStreet = this.getYearlyRevenueModel(ParkingTypeEnum.OffStreet, ModelTypeEnum.TimeOfDay);
    // this.financialDashboardRevenue.timeOfDayRevenueModel.garages = this.getYearlyRevenueModel(ParkingTypeEnum.Garages, ModelTypeEnum.TimeOfDay);

    // this.financialDashboardRevenue.escalatingRevenueModel.onStreet = this.getYearlyRevenueModel(ParkingTypeEnum.OnStreet, ModelTypeEnum.Escalating);
    // this.financialDashboardRevenue.escalatingRevenueModel.offStreet = this.getYearlyRevenueModel(ParkingTypeEnum.OffStreet, ModelTypeEnum.Escalating);
    // this.financialDashboardRevenue.escalatingRevenueModel.garages = this.getYearlyRevenueModel(ParkingTypeEnum.Garages, ModelTypeEnum.Escalating);
    // console.log(this.financialDashboardRevenue);

    console.log(this.dashboardService);
    this.financialDashboardRevenue = this.dashboardService.getYearlyFinancialDashboardRevenue(this.financialDashboard);

    this.setSelectedReportView();
  }

  selectedReportView: Array<ZoneRevenueSummary> = new Array<ZoneRevenueSummary>();
  yearlyReport: any = {};
  setSelectedReportView() {
    this.selectedReportView = this.financialDashboardRevenue[this.selectedModel.name];
    console.log(this.selectedReportView);
    this.locationNames = [];
    if (this.selectedModel.modelName == "HOURLY") {
      if (this.financialDashboard.hourlyOnStreet.isAvailable)
        this.locationNames.push('onStreet');
      if (this.financialDashboard.hourlyOffStreet.isAvailable)
        this.locationNames.push('offStreet');
      if (this.financialDashboard.hourlyGarages.isAvailable)
        this.locationNames.push('garages');
    }
    if (this.selectedModel.modelName == "TIMEOFDAY") {
      if (this.financialDashboard.timeOfDayOnStreet.isAvailable)
        this.locationNames.push('onStreet');
      if (this.financialDashboard.timeOfDayOffStreet.isAvailable)
        this.locationNames.push('offStreet');
      if (this.financialDashboard.timeOfDayGarages.isAvailable)
        this.locationNames.push('garages');
    }
    if (this.selectedModel.modelName == "ESCALATING") {
      if (this.financialDashboard.escalatingOnStreet.isAvailable)
        this.locationNames.push('onStreet');
      if (this.financialDashboard.escalatingOffStreet.isAvailable)
        this.locationNames.push('offStreet');
      if (this.financialDashboard.escalatingGarages.isAvailable)
        this.locationNames.push('garages');
    }
    this.financialDashboardService.numberOfYears = this.financialDashboardService.calcuateForYears;
    if (this.locationNames.length == 0)
      this.financialDashboardService.numberOfYears = [];
  }

  // getProjectedRevenueSummaryByModelType(parkingType: ParkingTypeEnum, modelType: ModelTypeEnum) {
  //   switch (modelType) {
  //     case ModelTypeEnum.Hourly:
  //       let hourlyModel: SetupHourlyModelDto = this.getHourlyModelByParkingType(parkingType);
  //       return this.businessService.getProjectedRevenueSummaryHourlyRateModel(hourlyModel);
  //     case ModelTypeEnum.TimeOfDay:
  //       let timeOfDayModel: SetupTimeOfDayModelDto = this.getTimeOfDayModelByParkingType(parkingType);
  //       return this.businessService.getProjectedRevenueSummaryTimeOfDayRateModel(timeOfDayModel);
  //     case ModelTypeEnum.Escalating:
  //       let escalatingModel: SetupEscalatingModelDto = this.getEscalatingModelByParkingType(parkingType);
  //       return this.businessService.getProjectedRevenueSummaryEscalatingRateModel(escalatingModel);
  //   }
  //   return null;
  // }

  // getHourlyModelByParkingType(parkingType: ParkingTypeEnum, modelType: ModelTypeEnum = 0) {
  //   switch (parkingType) {
  //     case ParkingTypeEnum.OnStreet:
  //       return this.financialDashboard.hourlyOnStreet;
  //     case ParkingTypeEnum.OffStreet:
  //       return this.financialDashboard.hourlyOffStreet;
  //     case ParkingTypeEnum.Garages:
  //       return this.financialDashboard.hourlyGarages;
  //   }
  //   return null;
  // }
  // getTimeOfDayModelByParkingType(parkingType: ParkingTypeEnum, modelType: ModelTypeEnum = 0) {
  //   switch (parkingType) {
  //     case ParkingTypeEnum.OnStreet:
  //       return this.financialDashboard.timeOfDayOnStreet;
  //     case ParkingTypeEnum.OffStreet:
  //       return this.financialDashboard.timeOfDayOffStreet;
  //     case ParkingTypeEnum.Garages:
  //       return this.financialDashboard.timeOfDayGarages;
  //   }
  //   return null;
  // }
  // getEscalatingModelByParkingType(parkingType: ParkingTypeEnum, modelType: ModelTypeEnum = 0) {
  //   switch (parkingType) {
  //     case ParkingTypeEnum.OnStreet:
  //       return this.financialDashboard.escalatingOnStreet;
  //     case ParkingTypeEnum.OffStreet:
  //       return this.financialDashboard.escalatingOffStreet;
  //     case ParkingTypeEnum.Garages:
  //       return this.financialDashboard.escalatingGarages;
  //   }
  //   return null;
  // }
  // getEuipmentCostByParkingType(parkingType: ParkingTypeEnum) {
  //   switch (parkingType) {
  //     case ParkingTypeEnum.OnStreet:
  //       return this.businessService.getProjectedEquipmentCostSummary(this.financialDashboard.onStreetEquipmentCost);
  //     case ParkingTypeEnum.OffStreet:
  //       return this.businessService.getProjectedEquipmentCostSummary(this.financialDashboard.offStreetEquipmentCost);
  //     case ParkingTypeEnum.Garages:
  //       return this.businessService.getProjectedEquipmentCostSummary(this.financialDashboard.garagesEquipmentCost);
  //   }
  //   return null;
  // }

  // getYearlyRevenueModel(parkingType: ParkingTypeEnum, modelType: ModelTypeEnum) {
  //   let yearlyReport: any = {};
  //   this.financialDashboardService.calcuateForYears.forEach((year: number) => {
  //     let projectedRevenueSummary: ProjectedRevenueSummary = this.getProjectedRevenueSummaryByModelType(parkingType, modelType);
  //     let projectedEquipmentCostSummary: ProjectedEquipmentCostSummary = this.getEuipmentCostByParkingType(parkingType);

  //     let zoneRevenueSummaryList: Array<ZoneRevenueSummary> = new Array<ZoneRevenueSummary>();

  //     projectedRevenueSummary.zoneSummaryList.forEach((zone: ZoneSummary) => {
  //       let zoneEquipmentSummary: ZoneEquipmentSummary = projectedEquipmentCostSummary.zoneEquipmentList.find(x => x.zoneCode == zone.zoneCode);
  //       // //If null then set default to avoid error
  //       // if (zoneEquipmentSummary == null)
  //       //   zoneEquipmentSummary = new ZoneEquipmentSummary();

  //       let zoneRevenueSummary: ZoneRevenueSummary = new ZoneRevenueSummary();
  //       zoneRevenueSummary.zoneName = zone.zoneName;
  //       zoneRevenueSummary.nonPeak = new ZoneRevenue((zone.nonPeak.total * year), zoneEquipmentSummary["totalEstimatedEquipmentAndOperatingCost" + year]);
  //       zoneRevenueSummary.peak = new ZoneRevenue((zone.peak.total * year), zoneEquipmentSummary["totalEstimatedEquipmentAndOperatingCost" + year]);
  //       zoneRevenueSummaryList.push(zoneRevenueSummary);
  //     });

  //     let zoneRevenueSummaryTotal: ZoneRevenueSummary = new ZoneRevenueSummary();
  //     zoneRevenueSummaryTotal.zoneName = "Total";
  //     zoneRevenueSummaryList.forEach((zoneRevenueSummary: ZoneRevenueSummary) => {
  //       zoneRevenueSummaryTotal.nonPeak.revenue += zoneRevenueSummary.nonPeak.revenue;
  //       zoneRevenueSummaryTotal.nonPeak.cost += zoneRevenueSummary.nonPeak.cost;
  //       zoneRevenueSummaryTotal.nonPeak.gain += zoneRevenueSummary.nonPeak.gain;

  //       zoneRevenueSummaryTotal.peak.revenue += zoneRevenueSummary.peak.revenue;
  //       zoneRevenueSummaryTotal.peak.cost += zoneRevenueSummary.peak.cost;
  //       zoneRevenueSummaryTotal.peak.gain += zoneRevenueSummary.peak.gain;
  //     });
  //     zoneRevenueSummaryList.push(zoneRevenueSummaryTotal);
  //     yearlyReport[year] = zoneRevenueSummaryList;
  //   });
  //   return yearlyReport;
  // }

  selectedModel: any = this.modelTypes[0];
  onModelChange(model) {
    this.selectedModel = model;
    this.setSelectedReportView();
  }

}
