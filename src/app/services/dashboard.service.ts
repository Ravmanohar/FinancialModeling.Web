import { Injectable } from '@angular/core';
import { FinancialDashboardRevenueModel, RevenueModel, ZoneRevenueSummary, ZoneRevenue, FinancialDashboardDto, DashboardEquipmentCostSummary } from '../components/financial-dashboard/financial-dashboard.models';
import { ParkingTypeEnum, ModelTypeEnum } from '../models/enums';
import { FinancialDashboardService } from '../components/financial-dashboard/financial-dashboard.service';
import { ProjectedRevenueSummary, ProjectedEquipmentCostSummary, ZoneSummary, ZoneEquipmentSummary } from '../models/common.models';
import { SetupHourlyModelDto, SetupTimeOfDayModelDto } from '../models/setup.model.index';
import { SetupEscalatingModelDto } from '../models/setup-escalating-model';
import { BusinessService } from './business.service';

@Injectable({ providedIn: 'root' })
export class DashboardService {

  constructor(
    public financialDashboardService: FinancialDashboardService,
    public businessService: BusinessService,
  ) { }

  public financialDashboard: FinancialDashboardDto = new FinancialDashboardDto();
  financialDashboardRevenue: FinancialDashboardRevenueModel = new FinancialDashboardRevenueModel();

  getYearlyFinancialDashboardRevenue(financialDashboard: FinancialDashboardDto) {
    this.financialDashboard = financialDashboard;

    let financialDashboardRevenue: FinancialDashboardRevenueModel = new FinancialDashboardRevenueModel();
    financialDashboardRevenue.hourlyRevenueModel = new RevenueModel();

    this.businessService.setGlobals(this.financialDashboard);

    financialDashboardRevenue.hourlyRevenueModel.onStreet = this.getYearlyRevenueModel(ParkingTypeEnum.OnStreet, ModelTypeEnum.Hourly);
    financialDashboardRevenue.hourlyRevenueModel.offStreet = this.getYearlyRevenueModel(ParkingTypeEnum.OffStreet, ModelTypeEnum.Hourly);
    financialDashboardRevenue.hourlyRevenueModel.garages = this.getYearlyRevenueModel(ParkingTypeEnum.Garages, ModelTypeEnum.Hourly);

    financialDashboardRevenue.timeOfDayRevenueModel.onStreet = this.getYearlyRevenueModel(ParkingTypeEnum.OnStreet, ModelTypeEnum.TimeOfDay);
    financialDashboardRevenue.timeOfDayRevenueModel.offStreet = this.getYearlyRevenueModel(ParkingTypeEnum.OffStreet, ModelTypeEnum.TimeOfDay);
    financialDashboardRevenue.timeOfDayRevenueModel.garages = this.getYearlyRevenueModel(ParkingTypeEnum.Garages, ModelTypeEnum.TimeOfDay);

    financialDashboardRevenue.escalatingRevenueModel.onStreet = this.getYearlyRevenueModel(ParkingTypeEnum.OnStreet, ModelTypeEnum.Escalating);
    financialDashboardRevenue.escalatingRevenueModel.offStreet = this.getYearlyRevenueModel(ParkingTypeEnum.OffStreet, ModelTypeEnum.Escalating);
    financialDashboardRevenue.escalatingRevenueModel.garages = this.getYearlyRevenueModel(ParkingTypeEnum.Garages, ModelTypeEnum.Escalating);

    return financialDashboardRevenue;
  }

  private getYearlyRevenueModel(parkingType: ParkingTypeEnum, modelType: ModelTypeEnum) {
    let yearlyReport: any = {};
    this.financialDashboardService.calcuateForYears.forEach((year: number) => {
      let projectedRevenueSummary: ProjectedRevenueSummary = this.getProjectedRevenueSummaryByModelType(parkingType, modelType);
      let projectedEquipmentCostSummary: ProjectedEquipmentCostSummary = this.getEuipmentCostByParkingType(parkingType);

      let zoneRevenueSummaryList: Array<ZoneRevenueSummary> = new Array<ZoneRevenueSummary>();

      projectedRevenueSummary.zoneSummaryList.forEach((zone: ZoneSummary) => {
        let zoneEquipmentSummary: ZoneEquipmentSummary = projectedEquipmentCostSummary.zoneEquipmentList.find(x => x.zoneCode == zone.zoneCode);
        // //If null then set default to avoid error
        // if (zoneEquipmentSummary == null)
        //   zoneEquipmentSummary = new ZoneEquipmentSummary();

        let zoneRevenueSummary: ZoneRevenueSummary = new ZoneRevenueSummary();
        zoneRevenueSummary.zoneName = zone.zoneName;
        zoneRevenueSummary.nonPeak = new ZoneRevenue((zone.nonPeak.total * year), zoneEquipmentSummary["totalEstimatedEquipmentAndOperatingCost" + year]);
        zoneRevenueSummary.peak = new ZoneRevenue((zone.peak.total * year), zoneEquipmentSummary["totalEstimatedEquipmentAndOperatingCost" + year]);
        zoneRevenueSummaryList.push(zoneRevenueSummary);
      });

      let zoneRevenueSummaryTotal: ZoneRevenueSummary = new ZoneRevenueSummary();
      zoneRevenueSummaryTotal.zoneName = "Total";
      zoneRevenueSummaryList.forEach((zoneRevenueSummary: ZoneRevenueSummary) => {
        zoneRevenueSummaryTotal.nonPeak.revenue += zoneRevenueSummary.nonPeak.revenue;
        zoneRevenueSummaryTotal.nonPeak.cost += zoneRevenueSummary.nonPeak.cost;
        zoneRevenueSummaryTotal.nonPeak.gain += zoneRevenueSummary.nonPeak.gain;

        zoneRevenueSummaryTotal.peak.revenue += zoneRevenueSummary.peak.revenue;
        zoneRevenueSummaryTotal.peak.cost += zoneRevenueSummary.peak.cost;
        zoneRevenueSummaryTotal.peak.gain += zoneRevenueSummary.peak.gain;
      });
      zoneRevenueSummaryList.push(zoneRevenueSummaryTotal);
      yearlyReport["year" + year] = zoneRevenueSummaryList;
    });
    return yearlyReport;
  }

  private getProjectedRevenueSummaryByModelType(parkingType: ParkingTypeEnum, modelType: ModelTypeEnum) {
    switch (modelType) {
      case ModelTypeEnum.Hourly:
        let hourlyModel: SetupHourlyModelDto = this.getHourlyModelByParkingType(parkingType);
        hourlyModel = this.businessService.getHourlyModel(hourlyModel);
        return this.businessService.getProjectedRevenueSummaryHourlyRateModel(hourlyModel);
      case ModelTypeEnum.TimeOfDay:
        let timeOfDayModel: SetupTimeOfDayModelDto = this.getTimeOfDayModelByParkingType(parkingType);
        timeOfDayModel = this.businessService.getTimeOfDayModel(timeOfDayModel);
        return this.businessService.getProjectedRevenueSummaryTimeOfDayRateModel(timeOfDayModel);
      case ModelTypeEnum.Escalating:
        let escalatingModel: SetupEscalatingModelDto = this.getEscalatingModelByParkingType(parkingType);
        escalatingModel = this.businessService.getEscalatingModel(escalatingModel);
        return this.businessService.getProjectedRevenueSummaryEscalatingRateModel(escalatingModel);
    }
    return null;
  }

  private getHourlyModelByParkingType(parkingType: ParkingTypeEnum, modelType: ModelTypeEnum = 0) {
    switch (parkingType) {
      case ParkingTypeEnum.OnStreet:
        return this.financialDashboard.hourlyOnStreet;
      case ParkingTypeEnum.OffStreet:
        return this.financialDashboard.hourlyOffStreet;
      case ParkingTypeEnum.Garages:
        return this.financialDashboard.hourlyGarages;
    }
    return null;
  }

  private getTimeOfDayModelByParkingType(parkingType: ParkingTypeEnum, modelType: ModelTypeEnum = 0) {
    switch (parkingType) {
      case ParkingTypeEnum.OnStreet:
        return this.financialDashboard.timeOfDayOnStreet;
      case ParkingTypeEnum.OffStreet:
        return this.financialDashboard.timeOfDayOffStreet;
      case ParkingTypeEnum.Garages:
        return this.financialDashboard.timeOfDayGarages;
    }
    return null;
  }

  private getEscalatingModelByParkingType(parkingType: ParkingTypeEnum, modelType: ModelTypeEnum = 0) {
    switch (parkingType) {
      case ParkingTypeEnum.OnStreet:
        return this.financialDashboard.escalatingOnStreet;
      case ParkingTypeEnum.OffStreet:
        return this.financialDashboard.escalatingOffStreet;
      case ParkingTypeEnum.Garages:
        return this.financialDashboard.escalatingGarages;
    }
    return null;
  }

  private getEuipmentCostByParkingType(parkingType: ParkingTypeEnum) {
    switch (parkingType) {
      case ParkingTypeEnum.OnStreet:
        return this.businessService.getProjectedEquipmentCostSummary(this.financialDashboard.onStreetEquipmentCost, "OnStreet");
      case ParkingTypeEnum.OffStreet:
        return this.businessService.getProjectedEquipmentCostSummary(this.financialDashboard.offStreetEquipmentCost, "OffStreet");
      case ParkingTypeEnum.Garages:
        return this.businessService.getProjectedEquipmentCostSummary(this.financialDashboard.garagesEquipmentCost, "Garages");
      default:
        return null;
    }
  }

  public getDashboardEquipmentCostSummary(financialDashboard: FinancialDashboardDto) {
    let dashboardEquipmentCostSummary: DashboardEquipmentCostSummary = new DashboardEquipmentCostSummary();

    let onStreetProjectedEquipmentCostSummary: ProjectedEquipmentCostSummary = this.businessService.getProjectedEquipmentCostSummary(financialDashboard.onStreetEquipmentCost, "OnStreet");
    dashboardEquipmentCostSummary.onStreetZoneEquipmentSummary = onStreetProjectedEquipmentCostSummary.zoneEquipmentList.find(x => x.zoneName == "Combined");

    let offStreetProjectedEquipmentCostSummary: ProjectedEquipmentCostSummary = this.businessService.getProjectedEquipmentCostSummary(financialDashboard.offStreetEquipmentCost, "OffStreet");
    dashboardEquipmentCostSummary.offStreetZoneEquipmentSummary = offStreetProjectedEquipmentCostSummary.zoneEquipmentList.find(x => x.zoneName == "Combined");

    let garagesProjectedEquipmentCostSummary: ProjectedEquipmentCostSummary = this.businessService.getProjectedEquipmentCostSummary(financialDashboard.garagesEquipmentCost, "Garages");
    dashboardEquipmentCostSummary.garagesZoneEquipmentSummary = garagesProjectedEquipmentCostSummary.zoneEquipmentList.find(x => x.zoneName == "Combined");

    dashboardEquipmentCostSummary.equipmentBudget += dashboardEquipmentCostSummary.onStreetZoneEquipmentSummary.equipmentCost;
    dashboardEquipmentCostSummary.equipmentBudget += dashboardEquipmentCostSummary.offStreetZoneEquipmentSummary.equipmentCost;
    dashboardEquipmentCostSummary.equipmentBudget += dashboardEquipmentCostSummary.garagesZoneEquipmentSummary.equipmentCost;

    dashboardEquipmentCostSummary.annualOperatingCost += dashboardEquipmentCostSummary.onStreetZoneEquipmentSummary.subtotalOperatingCost;
    dashboardEquipmentCostSummary.annualOperatingCost += dashboardEquipmentCostSummary.offStreetZoneEquipmentSummary.subtotalOperatingCost;
    dashboardEquipmentCostSummary.annualOperatingCost += dashboardEquipmentCostSummary.garagesZoneEquipmentSummary.subtotalOperatingCost;

    return dashboardEquipmentCostSummary;
  }

}
