import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/services/config.service';
import { Observable, of as observableOf } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { HttpClient } from '@angular/common/http';
// import {
//     HourlyZone, SetupHourlyModelDto,
//     HourlyOperatingHour,
//     HourlyRevenueModel, PermitZone, Permit, ZoneSummary, RevenueInfo, Zone, SetupTimeOfDayModelDto
// } from 'src/app/models/setup.model.index';
import { HttpErrorResponse } from '@angular/common/http';
import { FinancialDashboardDto } from 'src/app/components/financial-dashboard/financial-dashboard.models';
import { OperatingDays } from 'src/app/models/common.models';
import { SetupHourlyModelDto, HourlyZone, SetupTimeOfDayModelDto } from 'src/app/models/setup.model.index';

declare var $;
declare var toastr;
declare var moment;

@Injectable({
    providedIn: 'root'
})
export class FinancialDashboardService {
    private apiUrl: string;
    private authUrl: string;
    constructor(
        private authenticationService: AuthenticationService,
        private appConfig: AppConfig, private http: HttpClient) {

        this.apiUrl = this.appConfig.config.apiUrl;
        this.authUrl = this.appConfig.config.authUrl;
    }

    isFinancialDashboardLoaded: boolean = true;
    financialDashboard: FinancialDashboardDto = new FinancialDashboardDto();

    calcuateForYears: Array<number> = [1, 2, 3, 4, 5];
    numberOfYears: Array<number> = [1, 2, 3, 4, 5];
    hourlyRevenueColumns: Array<string> = ['hourly', 'permit', 'total'];

    dashboardColumns: Array<string> = ['revenue', 'cost', 'gain'];

    zoneEquipmentColumns: Array<string> = [
        'equipmentCost', 'estimatedSoftwareFees', 'estimatedCreditCardTransactionFees', 'estimatedCostOfAdditionalSparesAndMisc', 'subtotalOperatingCost', 'total',
        'emptyRow',
        'warrantyCostYear2', 'warrantyCostYear3', 'warrantyCostYear4', 'warrantyCostYear5',
        'emptyRow',
        'totalEstimatedEquipmentAndOperatingCost1', 'totalEstimatedEquipmentAndOperatingCost2', 'totalEstimatedEquipmentAndOperatingCost3', 'totalEstimatedEquipmentAndOperatingCost4', 'totalEstimatedEquipmentAndOperatingCost5',
    ];
    zoneEquipmentLabels: any = {
        equipmentCost: "Equipment Cost",
        estimatedSoftwareFees: "Estimated Software Fees - Year 1",
        estimatedCreditCardTransactionFees: "Estimated Credit Card Transaction Fees - Year 1",
        estimatedCostOfAdditionalSparesAndMisc: "Estimated Cost of Additional Spares & Misc - Year 1",
        subtotalOperatingCost: "Subtotal Operating Cost",
        total: "Total",

        warrantyCostYear2: "Warranty Cost - Year 2",
        warrantyCostYear3: "Warranty Cost - Year 3",
        warrantyCostYear4: "Warranty Cost - Year 4",
        warrantyCostYear5: "Warranty Cost - Year 5",

        totalEstimatedEquipmentAndOperatingCost1: "Equipment & Operating Cost - Year 0-1",
        totalEstimatedEquipmentAndOperatingCost2: "Equipment & Operating Cost - Year 1-2",
        totalEstimatedEquipmentAndOperatingCost3: "Equipment & Operating Cost - Year 2-3",
        totalEstimatedEquipmentAndOperatingCost4: "Equipment & Operating Cost - Year 3-4",
        totalEstimatedEquipmentAndOperatingCost5: "Equipment & Operating Cost - Year 4-5",
    };

    // getFinancialDashboard() {
    //     console.log("getFinancialDashboard api call");
    //     var apiPath = "./assets/json/financial-dashboard.json";
    //     return this.http.get(apiPath);
    // }

    getTotalHours(strat, end) {
        var minuits = 60;// var strat = "8:30 AM"; var end = "6:00 PM";
        var startTime = moment(strat, ["h:mm A"]);//.format("HH:mm");
        var endTime = moment(end, ["h:mm A"]);//.format("HH:mm");
        var totalHours = endTime.diff(startTime, 'minutes') / minuits;
        return totalHours;
    }

    hourlyModelGetYearInfo(operatingDays: OperatingDays) {
        operatingDays = new OperatingDays();
        return {
            yearRound: operatingDays.daysPerYear,
            peakDays: operatingDays.peakDays,
            offDays: operatingDays.offDays,
            nonPeakDays: operatingDays.daysPerYear - (operatingDays.peakDays + operatingDays.offDays)
        }
    }

    hourlyModelGetNumberOfSpacesRemaining(hourlyParkingZone: HourlyZone) {
        var total = hourlyParkingZone.numberOfSpacesPerZone;
        var occupiedPercent = hourlyParkingZone.percentOfSpaceOccupied;
        var occupiedCount = (total * occupiedPercent) / 100;
        var remainingCount = total - occupiedCount;
        return remainingCount;
    }
}
