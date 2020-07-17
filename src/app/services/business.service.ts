import { Injectable } from '@angular/core';
import { AppConfig } from 'src/app/services/config.service';
import { Observable, of as observableOf } from 'rxjs';
import { HourlyZone, SetupHourlyModelDto } from 'src/app/models/setup-hourly-model';
import { SetupTimeOfDayModelDto, TimeOfDayZone, FinancialDashboardDto } from '../models/setup.model.index';
import { TimeOfDayOperatingHour } from '../models/setup-timeofday-model';
import { SetupEscalatingModelDto, EscalatingZone, HourlyPercentValue } from '../models/setup-escalating-model';
import { ZoneSummary, RevenueInfo, ProjectedRevenueSummary, ProjectedEquipmentCostSummary, ZoneEquipmentSummary, ClientPermitType, OperatingDays } from '../models/common.models';
import { LocationEquipmentCost, EquipmentZone, EquipmentCost } from '../models/setup-equipment-cost.model';
import { EditClientModel } from '../models/add-client-model';

declare var $;
declare var toastr;
declare var moment;
@Injectable({
    providedIn: 'root'
})
export class BusinessService {
    constructor(
        private appConfig: AppConfig,
    ) {
    }

    isPeakSeasonPricing: boolean = false;
    havePermits: boolean = false;

    setGlobals(financialDashboard: FinancialDashboardDto) {
        this.isPeakSeasonPricing = financialDashboard.editClientModel.isPeakSeasonPricing;
        this.havePermits = financialDashboard.editClientModel.havePermits;
    }

    addEmptyRow(property, emptyRow, rows) {
        rows.push(emptyRow);
    }

    getTotalHours(strat, end) {
        var minuits = 60;// var strat = "8:30 AM"; var end = "6:00 PM";
        var startTime = moment(strat, ["h:mm A"]);//.format("HH:mm");
        var endTime = moment(end, ["h:mm A"]);//.format("HH:mm");
        var totalHours = endTime.diff(startTime, 'minutes') / minuits;

        if (totalHours < 0)
            totalHours = 24 - Math.abs(totalHours);;
        return totalHours;
    }

    getFormattedTime(time: string) {
        // return moment(time, ["h:mm A"]).format("HH:mm");
        return time;
    }

    getNumberOfSpacesRemaining(numberOfSpacesPerZone, percentOfSpaceOccupied) {
        var total = numberOfSpacesPerZone;
        var occupiedPercent = percentOfSpaceOccupied;
        var occupiedCount = (total * occupiedPercent) / 100;
        var remainingCount = total - occupiedCount;
        return remainingCount;
    }

    getHourlyModel(hourlyModel: SetupHourlyModelDto) {
        hourlyModel.hourlyZones.forEach((hourlyZone: HourlyZone) => {

            if (this.isPeakSeasonPricing == false) {
                hourlyZone.operatingDays.peakDays = 0;
                hourlyZone.peakSeasonHourlyRate = 0;
                hourlyZone.peakOccupancyPercentage = 0;
                hourlyZone.clientPermitTypes.forEach((permit: ClientPermitType) => {
                    permit.quantitySold = 0;
                    permit.annualCost = 0;
                });
            }
            if (this.havePermits == false) {
                hourlyZone.percentOfSpaceOccupied = 0;
            }

            hourlyZone.operatingDays = this.getCalculatedDaysPerYear(hourlyZone.operatingDays);

            let totalHours: number = this.getTotalHours(hourlyZone.hourlyOperatingHour.startTime, hourlyZone.hourlyOperatingHour.endTime);
            hourlyZone.hourlyOperatingHour.totalHours = totalHours;
            hourlyZone.hourlyOperatingHour.startTime = this.getFormattedTime(hourlyZone.hourlyOperatingHour.startTime);
            hourlyZone.hourlyOperatingHour.endTime = this.getFormattedTime(hourlyZone.hourlyOperatingHour.endTime);
            hourlyZone.numberOfSpacesRemaining = this.getNumberOfSpacesRemaining(hourlyZone.numberOfSpacesPerZone, hourlyZone.percentOfSpaceOccupied);
        });
        return hourlyModel;
    }

    getTimeOfDayModel(timeOfDayModel: SetupTimeOfDayModelDto) {
        timeOfDayModel.timeOfDayZones.forEach((timeOfDayZone: TimeOfDayZone) => {

            if (this.isPeakSeasonPricing == false) {
                timeOfDayZone.operatingDays.peakDays = 0;
                timeOfDayZone.hoursOfOperations.forEach((hoursOfOperation: TimeOfDayOperatingHour) => {
                    hoursOfOperation.peakOccupancyPercentage = 0;
                    hoursOfOperation.peakSeasonHourlyRate = 0;
                    hoursOfOperation.operatingHoursStart = hoursOfOperation.operatingHoursStart;
                    hoursOfOperation.operatingHoursEnd = hoursOfOperation.operatingHoursEnd;
                });
                timeOfDayZone.clientPermitTypes.forEach((permit: ClientPermitType) => {
                    permit.quantitySold = 0;
                    permit.annualCost = 0;
                });
            }
            if (this.havePermits == false) {
                timeOfDayZone.percentOfSpaceOccupied = 0;
            }

            timeOfDayZone.operatingDays = this.getCalculatedDaysPerYear(timeOfDayZone.operatingDays);

            timeOfDayZone.numberOfSpacesRemaining = this.getNumberOfSpacesRemaining(timeOfDayZone.numberOfSpacesPerZone, timeOfDayZone.percentOfSpaceOccupied);
            timeOfDayZone.hoursOfOperations.forEach((hoursOfOperation: TimeOfDayOperatingHour) => {
                hoursOfOperation.totalHours = this.getTotalHours(hoursOfOperation.operatingHoursStart, hoursOfOperation.operatingHoursEnd);
                hoursOfOperation.operatingHoursStart = this.getFormattedTime(hoursOfOperation.operatingHoursStart);
                hoursOfOperation.operatingHoursEnd = this.getFormattedTime(hoursOfOperation.operatingHoursEnd);
            });
        });
        return timeOfDayModel;
    }

    getEscalatingModel(escalatingModel: SetupEscalatingModelDto) {
        escalatingModel.escalatingZones.forEach((escalatingZone: EscalatingZone) => {

            if (this.isPeakSeasonPricing == false) {
                escalatingZone.operatingDays.peakDays = 0;
                escalatingZone.peakHourlyRate = 0;
                escalatingZone.peakEscalatingRate = 0;
                escalatingZone.peakHourEscalatingRateBegins = 0;
                escalatingZone.peakDailyMaxOrAllDayRate = 0;
                escalatingZone.peakEveningFlatRate = 0;
                escalatingZone.peakOccupancyPercentage = 0;
                escalatingZone.clientPermitTypes.forEach((permit: ClientPermitType) => {
                    permit.quantitySold = 0;
                    permit.annualCost = 0;
                });
            }

            if (this.havePermits == false) {
                escalatingZone.percentOfSpaceOccupied = 0;
            }

            escalatingZone.operatingDays = this.getCalculatedDaysPerYear(escalatingZone.operatingDays);

            escalatingZone.escalatingOperatingHourDaily.totalHours = this.getTotalHours(escalatingZone.escalatingOperatingHourDaily.startTime, escalatingZone.escalatingOperatingHourDaily.endTime);
            escalatingZone.escalatingOperatingHourDaily.startTime = this.getFormattedTime(escalatingZone.escalatingOperatingHourDaily.startTime);
            escalatingZone.escalatingOperatingHourDaily.endTime = this.getFormattedTime(escalatingZone.escalatingOperatingHourDaily.endTime);

            escalatingZone.escalatingOperatingHourEvening.totalHours = this.getTotalHours(escalatingZone.escalatingOperatingHourEvening.startTime, escalatingZone.escalatingOperatingHourEvening.endTime);
            escalatingZone.escalatingOperatingHourEvening.startTime = this.getFormattedTime(escalatingZone.escalatingOperatingHourEvening.startTime);
            escalatingZone.escalatingOperatingHourEvening.endTime = this.getFormattedTime(escalatingZone.escalatingOperatingHourEvening.endTime);

            escalatingZone.numberOfSpacesRemaining = this.getNumberOfSpacesRemaining(escalatingZone.numberOfSpacesPerZone, escalatingZone.percentOfSpaceOccupied);

            let defaultdDailyHourlyPercentValuesList = [{ "hour": 1, "percent": 10 }, { "hour": 2, "percent": 10 }, { "hour": 3, "percent": 10 }, { "hour": 4, "percent": 10 }, { "hour": 5, "percent": 10 }, { "hour": 6, "percent": 10 }, { "hour": 7, "percent": 10 }, { "hour": 8, "percent": 10 }, { "hour": 9, "percent": 10 }, { "hour": 10, "percent": 10 }, { "hour": 11, "percent": 0 }, { "hour": 12, "percent": 0 }];
            if (escalatingZone.dailyHourlyPercentValuesJson == null) {
                escalatingZone.dailyHourlyPercentValuesJson = JSON.stringify(defaultdDailyHourlyPercentValuesList);
            }
            escalatingZone.dailyHourlyPercentValuesList = JSON.parse(escalatingZone.dailyHourlyPercentValuesJson);
            this.setHourlyPercentValues(escalatingZone.dailyHourlyPercentValuesList, escalatingZone.escalatingOperatingHourDaily.totalHours);
        });
        return escalatingModel;
    }

    getProjectedRevenueSummaryHourlyRateModel(hourlyModel: SetupHourlyModelDto) {
        let projectedRevenueSummary: ProjectedRevenueSummary = new ProjectedRevenueSummary();
        if (hourlyModel.isAvailable) {
            hourlyModel.hourlyZones.forEach((hourlyZone: HourlyZone) => {
                let totalHours: number = this.getTotalHours(hourlyZone.hourlyOperatingHour.startTime, hourlyZone.hourlyOperatingHour.endTime);
                hourlyZone.hourlyOperatingHour.totalHours = totalHours;
                hourlyZone.hourlyOperatingHour.startTime = this.getFormattedTime(hourlyZone.hourlyOperatingHour.startTime);
                hourlyZone.hourlyOperatingHour.endTime = this.getFormattedTime(hourlyZone.hourlyOperatingHour.endTime);
                hourlyZone.numberOfSpacesRemaining = this.getNumberOfSpacesRemaining(hourlyZone.numberOfSpacesPerZone, hourlyZone.percentOfSpaceOccupied);

                // Start : Revenue Calculations
                // var daysPerYear = hourlyZone.operatingDays.daysPerYear;
                var daysPerYear = (hourlyZone.operatingDays.daysPerYear - hourlyZone.operatingDays.offDays);
                var hourlyRevenueNonPeak = hourlyZone.nonPeakSeasonHourlyRate * hourlyZone.numberOfSpacesRemaining * daysPerYear * hourlyZone.hourlyOperatingHour.totalHours * (hourlyZone.compliancePercentage / 100) * (hourlyZone.nonPeakOccupancyPercentage / 100);
                var hourlyRevenuePeak = (hourlyZone.nonPeakSeasonHourlyRate * hourlyZone.numberOfSpacesRemaining * hourlyZone.operatingDays.nonPeakDays * hourlyZone.hourlyOperatingHour.totalHours * (hourlyZone.compliancePercentage / 100) * (hourlyZone.nonPeakOccupancyPercentage / 100)) +
                    (hourlyZone.peakSeasonHourlyRate * hourlyZone.numberOfSpacesRemaining * hourlyZone.operatingDays.peakDays * hourlyZone.hourlyOperatingHour.totalHours * (hourlyZone.compliancePercentage / 100) * (hourlyZone.peakOccupancyPercentage / 100));
                var hourlyVariance = (hourlyRevenuePeak - hourlyRevenueNonPeak);
                console.log(hourlyRevenueNonPeak, hourlyRevenuePeak, hourlyVariance);

                let zoneSummary: ZoneSummary = new ZoneSummary();
                zoneSummary.zoneCode = hourlyZone.zoneCode;
                zoneSummary.zoneName = hourlyZone.zoneName;

                var permitRevenue = 0;
                hourlyZone.clientPermitTypes.forEach(permit => {
                    permitRevenue += ((permit.annualCost * permit.quantitySold) * 12);
                });
                zoneSummary.nonPeak = new RevenueInfo(hourlyRevenueNonPeak, permitRevenue);
                zoneSummary.peak = new RevenueInfo(hourlyRevenuePeak, permitRevenue);

                zoneSummary.variance = new RevenueInfo(0, 0);
                zoneSummary.variance.hourly = zoneSummary.peak.hourly - zoneSummary.nonPeak.hourly;
                zoneSummary.variance.permit = zoneSummary.peak.permit - zoneSummary.nonPeak.permit;
                zoneSummary.variance.total = zoneSummary.peak.total - zoneSummary.nonPeak.total;
                projectedRevenueSummary.zoneSummaryList.push(zoneSummary);
                // Start : Revenue Calculations
            });
        }
        return projectedRevenueSummary;
    }

    getProjectedRevenueSummaryTimeOfDayRateModel(timeOfDayModel: SetupTimeOfDayModelDto) {
        let projectedRevenueSummary: ProjectedRevenueSummary = new ProjectedRevenueSummary();

        timeOfDayModel.timeOfDayZones.forEach((timeOfDayZone: TimeOfDayZone) => {
            timeOfDayZone.numberOfSpacesRemaining = this.getNumberOfSpacesRemaining(timeOfDayZone.numberOfSpacesPerZone, timeOfDayZone.percentOfSpaceOccupied);

            let zoneSummary: ZoneSummary = new ZoneSummary();
            zoneSummary.zoneCode = timeOfDayZone.zoneCode;
            zoneSummary.zoneName = timeOfDayZone.zoneName;

            var permitRevenue = 0;
            timeOfDayZone.clientPermitTypes.forEach(permit => {
                permitRevenue += ((permit.annualCost * permit.quantitySold) * 12);
            });
            var timeOfDayRevenueNonPeak = 0, timeOfDayRevenuePeak = 0;
            var nonPeakSlotRevenue = 0, peakSlotRevenue;
            timeOfDayZone.hoursOfOperations.forEach((hoursOfOperation) => {
                let totalHours: number = this.getTotalHours(hoursOfOperation.operatingHoursStart, hoursOfOperation.operatingHoursEnd);
                hoursOfOperation.totalHours = totalHours;
                hoursOfOperation.operatingHoursStart = this.getFormattedTime(hoursOfOperation.operatingHoursStart);
                hoursOfOperation.operatingHoursEnd = this.getFormattedTime(hoursOfOperation.operatingHoursEnd);

                timeOfDayRevenueNonPeak += (hoursOfOperation.nonPeakSeasonHourlyRate * timeOfDayZone.numberOfSpacesRemaining * timeOfDayZone.operatingDays.peakDays * (timeOfDayZone.compliancePercentage / 100) * (hoursOfOperation.peakOccupancyPercentage / 100) * hoursOfOperation.totalHours);
                timeOfDayRevenueNonPeak += (hoursOfOperation.nonPeakSeasonHourlyRate * timeOfDayZone.numberOfSpacesRemaining * timeOfDayZone.operatingDays.nonPeakDays * (timeOfDayZone.compliancePercentage / 100) * (hoursOfOperation.nonPeakOccupancyPercentage / 100) * hoursOfOperation.totalHours);

                timeOfDayRevenuePeak += (hoursOfOperation.nonPeakSeasonHourlyRate * timeOfDayZone.numberOfSpacesRemaining * timeOfDayZone.operatingDays.nonPeakDays * (timeOfDayZone.compliancePercentage / 100) * (hoursOfOperation.peakOccupancyPercentage / 100) * hoursOfOperation.totalHours);
                timeOfDayRevenuePeak += (hoursOfOperation.peakSeasonHourlyRate * timeOfDayZone.numberOfSpacesRemaining * timeOfDayZone.operatingDays.peakDays * (timeOfDayZone.compliancePercentage / 100) * (hoursOfOperation.nonPeakOccupancyPercentage / 100) * hoursOfOperation.totalHours);
            });
            var permitRevenue = 0;
            timeOfDayZone.clientPermitTypes.forEach(permit => {
                permitRevenue += ((permit.annualCost * permit.quantitySold) * 12);
            });
            zoneSummary.nonPeak = new RevenueInfo(timeOfDayRevenueNonPeak, permitRevenue);
            zoneSummary.peak = new RevenueInfo(timeOfDayRevenuePeak, permitRevenue);

            zoneSummary.variance = new RevenueInfo(0, 0);
            zoneSummary.variance.hourly = zoneSummary.peak.hourly - zoneSummary.nonPeak.hourly;
            zoneSummary.variance.permit = zoneSummary.peak.permit - zoneSummary.nonPeak.permit;
            zoneSummary.variance.total = zoneSummary.peak.total - zoneSummary.nonPeak.total;
            projectedRevenueSummary.zoneSummaryList.push(zoneSummary);
        });
        return projectedRevenueSummary;
    }

    getProjectedRevenueSummaryEscalatingRateModel(escalatingModel: SetupEscalatingModelDto) {
        let projectedRevenueSummary: ProjectedRevenueSummary = new ProjectedRevenueSummary();
        escalatingModel.escalatingZones.forEach((escalatingZone: EscalatingZone) => {
            let totalHoursDaily: number = this.getTotalHours(escalatingZone.escalatingOperatingHourDaily.startTime, escalatingZone.escalatingOperatingHourDaily.endTime);
            escalatingZone.escalatingOperatingHourDaily.totalHours = totalHoursDaily;
            escalatingZone.escalatingOperatingHourDaily.startTime = this.getFormattedTime(escalatingZone.escalatingOperatingHourDaily.startTime);
            escalatingZone.escalatingOperatingHourDaily.endTime = this.getFormattedTime(escalatingZone.escalatingOperatingHourDaily.endTime);

            let totalHoursEvening: number = this.getTotalHours(escalatingZone.escalatingOperatingHourEvening.startTime, escalatingZone.escalatingOperatingHourEvening.endTime);
            escalatingZone.escalatingOperatingHourEvening.totalHours = totalHoursEvening;
            escalatingZone.escalatingOperatingHourEvening.startTime = this.getFormattedTime(escalatingZone.escalatingOperatingHourEvening.startTime);
            escalatingZone.escalatingOperatingHourEvening.endTime = this.getFormattedTime(escalatingZone.escalatingOperatingHourEvening.endTime);

            escalatingZone.numberOfSpacesRemaining = this.getNumberOfSpacesRemaining(escalatingZone.numberOfSpacesPerZone, escalatingZone.percentOfSpaceOccupied);

            // Start : Revenue Calculations
            var revenue = this.getCalcuationByZone(escalatingZone);
            var hourlyRevenueNonPeak = revenue.nonPeak;
            var hourlyRevenuePeak = revenue.peak;
            var hourlyVariance = (revenue.nonPeak - revenue.peak);
            console.log(hourlyRevenueNonPeak, hourlyRevenuePeak, hourlyVariance);

            let zoneSummary: ZoneSummary = new ZoneSummary();
            zoneSummary.zoneCode = escalatingZone.zoneCode;
            zoneSummary.zoneName = escalatingZone.zoneName;

            var permitRevenue = 0;
            escalatingZone.clientPermitTypes.forEach(permit => {
                permitRevenue += ((permit.annualCost * permit.quantitySold) * 12);
            });
            zoneSummary.nonPeak = new RevenueInfo(hourlyRevenueNonPeak, permitRevenue);
            zoneSummary.peak = new RevenueInfo(hourlyRevenuePeak, permitRevenue);

            zoneSummary.variance = new RevenueInfo(0, 0);
            zoneSummary.variance.hourly = zoneSummary.peak.hourly - zoneSummary.nonPeak.hourly;
            zoneSummary.variance.permit = zoneSummary.peak.permit - zoneSummary.nonPeak.permit;
            zoneSummary.variance.total = zoneSummary.peak.total - zoneSummary.nonPeak.total;
            projectedRevenueSummary.zoneSummaryList.push(zoneSummary);
            // Start : Revenue Calculations
        });
        console.log(projectedRevenueSummary);
        return projectedRevenueSummary;
    }

    // Start : Equipment Cost Calcuation Methods
    getSum(list: any, prop: string) {
        const _NUMBER_FORMAT_REGEXP = /^(\d+)?\.((\d+)(-(\d+))?)?$/;
        return list.reduce(function (a, b) {
            if (typeof b[prop] === 'number' || _NUMBER_FORMAT_REGEXP.test(b[prop]))
                return a + b[prop];
            else
                return b[prop];
        }, 0);
    }
    getEquipmentCostOnStreet(equipment: EquipmentCost) {
        // return equipment.unitsOwned * equipment.costOfBaseUnit;
        return equipment.unitsPurchased * equipment.costOfBaseUnit;
    }
    getEquipmentCost(equipment: EquipmentCost) {
        // return (equipment.quantityOfUnits * equipment.multiSpaceMeterCost) +
        //     (equipment.quantityOfUnits * equipment.equipWithBNA) +
        //     (equipment.quantityOfUnits * equipment.equipWithCreditCard);
        // console.log(equipment);
        return (equipment.unitsPurchased * equipment.costOfBaseUnit) +
            (equipment.quantityOfUnits * equipment.costOfBaseUnit) +
            (equipment.equipWithBNA + equipment.equipWithCreditCard);
    }
    getEstimatedSoftwareFeesOnStreet(equipment: EquipmentCost) {
        return ((equipment.unitsOwned * equipment.monthlyMeterSoftwareFees) * 12) + ((equipment.unitsPurchased * equipment.monthlyMeterSoftwareFees) * 12);
    }
    getEstimatedSoftwareFees(equipment: EquipmentCost) {
        // return (equipment.quantityOfUnits * equipment.annualSoftwareFee);
        return ((equipment.unitsOwned * equipment.annualSoftwareFee) +
            (equipment.unitsPurchased * equipment.annualSoftwareFee) +
            (equipment.quantityOfUnits * equipment.annualSoftwareFee)) * 12;
    }
    getEstimatedCreditCardTransactionFeesOnStreet(equipment: EquipmentCost, equipmentZone: EquipmentZone) {
        let yearsPerDay: number = equipmentZone.operatingDays;
        // console.log('yearsPerDay', yearsPerDay);
        let unitsOwnedCalc: number = (((equipment.unitsOwned * equipment.estimatedCreditCardTransaction) * equipment.monthlyCreditCardProcessingFees) * yearsPerDay);
        let unitsPurchasedCalc: number = (((equipment.unitsPurchased * equipment.estimatedCreditCardTransaction) * equipment.monthlyCreditCardProcessingFees) * yearsPerDay);
        return unitsOwnedCalc + unitsPurchasedCalc;
    }
    getEstimatedCreditCardTransactionFees(equipment: EquipmentCost, equipmentZone: EquipmentZone) {
        let yearsPerDay: number = equipmentZone.operatingDays;
        // console.log('yearsPerDay', yearsPerDay);
        // let unitsOwnedCalc: number = (((equipment.unitsOwned * equipment.estimatedCreditCardTransaction) * equipment.monthlyCreditCardProcessingFees) * yearsPerDay);
        // let unitsPurchasedCalc: number = (((equipment.unitsPurchased * equipment.estimatedCreditCardTransaction) * equipment.monthlyCreditCardProcessingFees) * yearsPerDay);
        // return unitsOwnedCalc + unitsPurchasedCalc;
        let unitsOwnedCalc: number = (equipment.unitsOwned * equipment.estimatedCreditCardTransaction) * equipment.monthlyCreditCardProcessingFees;
        let unitsPurchasedCalc: number = (equipment.unitsPurchased * equipment.estimatedCreditCardTransaction) * equipment.monthlyCreditCardProcessingFees;
        return (unitsOwnedCalc + unitsPurchasedCalc) * yearsPerDay;
    }
    // getEstimatedCostOfAdditionalSparesAndMiscOnStreet(equipment: EquipmentCost, equipmentCost: number) {
    //     return ((equipment.unitsOwned * equipment.costOfBaseUnit) + equipmentCost) * 0.1;
    // }
    getEstimatedCostOfAdditionalSparesAndMisc(equipmentCost: number) {
        return equipmentCost * 0.1;
    }
    getWarrantyCostOnStreet(equipment: EquipmentCost) {
        // return (equipment.unitsOwned * equipment.warrantyStartingYear) + (equipment.unitsPurchased * equipment.warrantyStartingYear);
        return (equipment.unitsPurchased * equipment.warrantyStartingYear);
    }
    getWarrantyCost(equipment: EquipmentCost) {
        // return equipment.isWarrantyIncluded ? "Included" : "Not Included";
        return (equipment.unitsPurchased * equipment.warrantyStartingYear) + (equipment.quantityOfUnits * equipment.warrantyStartingYear);
    }
    getTotalEstimatedEquipmentAndOperatingCostOnStreet(totalEstimatedEquipmentAndOperatingCost: number, subtotalOperatingCost: number, warrantyCostYear: number) {
        return totalEstimatedEquipmentAndOperatingCost + subtotalOperatingCost + warrantyCostYear;
    }
    getTotalEstimatedEquipmentAndOperatingCost(totalEstimatedEquipmentAndOperatingCost: number, subtotalOperatingCost: number, warrantyCostYear: number) {
        return totalEstimatedEquipmentAndOperatingCost + subtotalOperatingCost + warrantyCostYear;
    }

    // Start : Escalating Model Revenue calculations logic
    getProjectedEquipmentCostSummary(locationEquipmentCost: LocationEquipmentCost, locationName: string) {
        // alert("Start Garages");
        // console.log("Start Garages", locationEquipmentCost);
        console.log(locationEquipmentCost);
        let projectedEquipmentCostSummary: ProjectedEquipmentCostSummary = new ProjectedEquipmentCostSummary();
        projectedEquipmentCostSummary.zoneEquipmentList = new Array<ZoneEquipmentSummary>();
        // console.log(locationEquipmentCost);
        locationEquipmentCost.zones.forEach((zone: EquipmentZone) => {
            let zoneEquipmentSummary: ZoneEquipmentSummary = new ZoneEquipmentSummary();
            zoneEquipmentSummary.zoneCode = zone.zoneCode;
            zoneEquipmentSummary.zoneName = zone.zoneName;
            if (locationName == "OnStreet") {
                zone.equipments.forEach(equipment => {
                    let equipmentCost = this.getEquipmentCostOnStreet(equipment);
                    zoneEquipmentSummary.equipmentCost += equipmentCost;
                    let estimatedSoftwareFees = this.getEstimatedSoftwareFeesOnStreet(equipment);
                    zoneEquipmentSummary.estimatedSoftwareFees += estimatedSoftwareFees;
                    let estimatedCreditCardTransactionFees = this.getEstimatedCreditCardTransactionFeesOnStreet(equipment, zone);
                    zoneEquipmentSummary.estimatedCreditCardTransactionFees += estimatedCreditCardTransactionFees;
                    let estimatedCostOfAdditionalSparesAndMisc = this.getEstimatedCostOfAdditionalSparesAndMisc(equipmentCost);
                    zoneEquipmentSummary.estimatedCostOfAdditionalSparesAndMisc += estimatedCostOfAdditionalSparesAndMisc;
                    zoneEquipmentSummary.subtotalOperatingCost += (estimatedSoftwareFees + estimatedCreditCardTransactionFees + estimatedCostOfAdditionalSparesAndMisc);
                    zoneEquipmentSummary.total += (equipmentCost + estimatedSoftwareFees + estimatedCreditCardTransactionFees + estimatedCostOfAdditionalSparesAndMisc);

                    zoneEquipmentSummary.warrantyCostYear2 += this.getWarrantyCostOnStreet(equipment);
                    zoneEquipmentSummary.warrantyCostYear3 += this.getWarrantyCostOnStreet(equipment);
                    zoneEquipmentSummary.warrantyCostYear4 += this.getWarrantyCostOnStreet(equipment);
                    zoneEquipmentSummary.warrantyCostYear5 += this.getWarrantyCostOnStreet(equipment);

                    // Below calculations will calculation will be overriden for every itiration and retains value of last itiration as we are summing up everything
                    zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost1 = zoneEquipmentSummary.total;
                    zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost2 = this.getTotalEstimatedEquipmentAndOperatingCostOnStreet(zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost1, zoneEquipmentSummary.subtotalOperatingCost, zoneEquipmentSummary.warrantyCostYear2);
                    zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost3 = this.getTotalEstimatedEquipmentAndOperatingCostOnStreet(zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost2, zoneEquipmentSummary.subtotalOperatingCost, zoneEquipmentSummary.warrantyCostYear3);
                    zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost4 = this.getTotalEstimatedEquipmentAndOperatingCostOnStreet(zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost3, zoneEquipmentSummary.subtotalOperatingCost, zoneEquipmentSummary.warrantyCostYear4);
                    zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost5 = this.getTotalEstimatedEquipmentAndOperatingCostOnStreet(zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost4, zoneEquipmentSummary.subtotalOperatingCost, zoneEquipmentSummary.warrantyCostYear5);
                });
            } else {
                zone.equipments.forEach(equipment => {
                    let equipmentCost = this.getEquipmentCost(equipment);
                    zoneEquipmentSummary.equipmentCost += equipmentCost;
                    let estimatedSoftwareFees = this.getEstimatedSoftwareFees(equipment);
                    zoneEquipmentSummary.estimatedSoftwareFees += estimatedSoftwareFees;
                    let estimatedCreditCardTransactionFees = this.getEstimatedCreditCardTransactionFees(equipment, zone);
                    zoneEquipmentSummary.estimatedCreditCardTransactionFees += estimatedCreditCardTransactionFees;
                    let estimatedCostOfAdditionalSparesAndMisc = this.getEstimatedCostOfAdditionalSparesAndMisc(equipmentCost);
                    zoneEquipmentSummary.estimatedCostOfAdditionalSparesAndMisc += estimatedCostOfAdditionalSparesAndMisc;
                    let subtotalOperatingCost = estimatedSoftwareFees + estimatedCreditCardTransactionFees + estimatedCostOfAdditionalSparesAndMisc;
                    zoneEquipmentSummary.subtotalOperatingCost += subtotalOperatingCost;
                    zoneEquipmentSummary.total += equipmentCost + subtotalOperatingCost;

                    zoneEquipmentSummary.warrantyCostYear2 += this.getWarrantyCost(equipment);
                    zoneEquipmentSummary.warrantyCostYear3 += this.getWarrantyCost(equipment);
                    zoneEquipmentSummary.warrantyCostYear4 += this.getWarrantyCost(equipment);
                    zoneEquipmentSummary.warrantyCostYear5 += this.getWarrantyCost(equipment);

                    // Below calculations will calculation will be overriden for every itiration and retains value of last itiration as we are summing up everything
                    zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost1 = zoneEquipmentSummary.equipmentCost + zoneEquipmentSummary.subtotalOperatingCost;
                    zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost2 = this.getTotalEstimatedEquipmentAndOperatingCost(zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost1, zoneEquipmentSummary.subtotalOperatingCost, zoneEquipmentSummary.warrantyCostYear2);
                    zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost3 = this.getTotalEstimatedEquipmentAndOperatingCost(zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost2, zoneEquipmentSummary.subtotalOperatingCost, zoneEquipmentSummary.warrantyCostYear3);
                    zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost4 = this.getTotalEstimatedEquipmentAndOperatingCost(zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost3, zoneEquipmentSummary.subtotalOperatingCost, zoneEquipmentSummary.warrantyCostYear4);
                    zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost5 = this.getTotalEstimatedEquipmentAndOperatingCost(zoneEquipmentSummary.totalEstimatedEquipmentAndOperatingCost4, zoneEquipmentSummary.subtotalOperatingCost, zoneEquipmentSummary.warrantyCostYear5);
                });
            }
            projectedEquipmentCostSummary.zoneEquipmentList.push(zoneEquipmentSummary);
        });
        let combinedZoneSummary: ZoneEquipmentSummary = new ZoneEquipmentSummary();
        combinedZoneSummary.zoneName = "Combined";
        var calculatedTotalForProps = [
            "equipmentCost",
            "estimatedSoftwareFees",
            "estimatedCreditCardTransactionFees",
            "estimatedCostOfAdditionalSparesAndMisc",
            "subtotalOperatingCost",
            "total",
            "warrantyCostYear2",
            "warrantyCostYear3",
            "warrantyCostYear4",
            "warrantyCostYear5",
            "totalEstimatedEquipmentAndOperatingCost1",
            "totalEstimatedEquipmentAndOperatingCost2",
            "totalEstimatedEquipmentAndOperatingCost3",
            "totalEstimatedEquipmentAndOperatingCost4",
            "totalEstimatedEquipmentAndOperatingCost5",
        ];
        calculatedTotalForProps.forEach((propName: string) => {
            combinedZoneSummary[propName] = this.getSum(projectedEquipmentCostSummary.zoneEquipmentList, propName);
        });
        projectedEquipmentCostSummary.zoneEquipmentList.push(combinedZoneSummary);

        return projectedEquipmentCostSummary;
    }

    getNonPeakValue(pchv, hv, zone: EscalatingZone) {
        var thd = zone.escalatingOperatingHourDaily.totalHours; //$D$53 //TotalHours Daily
        var thev = zone.escalatingOperatingHourEvening.totalHours; //$D$53 //TotalHours Daily
        var nphr = zone.nonPeakHourlyRate; //$D$4 - NonPeak Hourly Rate = 1
        var nper = zone.nonPeakEscalatingRate; //$D$5 - NonPeak Escalating Rate = 1
        var npherb = zone.nonPeakHourEscalatingRateBegins; //$D$6 - NonPeak Hour Escalating Rate Begins = 3
        var npdm = zone.nonPeakDailyMaxOrAllDayRate; //$D$19 - NonPeak Daily Max/All Day Rate  = 20

        var defaultVal = 0;
        // var C7 = hv, $D$53 = thd, $D$4 = nphr, $D$5 = nper, $D$6 = npherb, $D$19 = npdm;
        return (hv > thd ? defaultVal : ((nphr < 0 || nper < 0) ? defaultVal : ((nphr === 0 && nper == 0) ? 0 : ((nphr == 0 && nper > 0 && hv < npherb) ? 0 : ((nper <= nphr && ((nphr * hv) <= npdm || npdm == 0)) ? (nphr * hv) : ((nper <= nphr && (nphr * hv) > npdm) ? npdm : ((nphr == 0 && nper > 0 && hv >= npherb && ((hv - npherb + 1) * (nper - nphr) <= npdm || npdm == 0)) ? (hv - npherb + 1) * (nper - nphr) : ((((nper > 0 && hv < npherb) || nper == 0) && ((nphr * hv) <= npdm || npdm == 0)) ? (nphr * hv) : ((nper > 0 && hv >= npherb && ((nphr * hv) + (hv - npherb + 1) * (nper - nphr) <= npdm || npdm == 0)) ? (nphr * hv) + (hv - npherb + 1) * (nper - nphr) : npdm)))))))))
    }
    getPeakValue(pchv, hv, zone: EscalatingZone) {
        var thd = zone.escalatingOperatingHourDaily.totalHours; //$D$53 //TotalHours Daily
        var thev = zone.escalatingOperatingHourEvening.totalHours; //$D$53 //TotalHours Daily
        var phr = zone.peakHourlyRate; //$D$23 - Peak Hourly Rate = 1
        var per = zone.peakEscalatingRate; //$D$24 - Peak Escalating Rate = 1
        var pherb = zone.peakHourEscalatingRateBegins; //$D$25 - Peak Hour Escalating Rate Begins = 3
        var pdm = zone.peakDailyMaxOrAllDayRate; //$D$38 - Peak Daily Max/All Day Rate  = 20

        var defaultVal = 0;
        // var C26 = hv, $D$53 = thd, $D$23 = phr, $D$24 = per, $D$25 = pherb, $D$38 = pdm;
        return (hv > thd ? defaultVal : ((phr < 0 || per < 0) ? defaultVal : ((phr === 0 && per == 0) ? 0 : ((phr == 0 && per > 0 && hv < pherb) ? 0 : ((per <= phr && ((phr * hv) <= pdm || pdm == 0)) ? (phr * hv) : ((per <= phr && (phr * hv) > pdm) ? pdm : ((phr == 0 && per > 0 && hv >= pherb && ((hv - pherb + 1) * (per - phr) <= pdm || pdm == 0)) ? (hv - pherb + 1) * (per - phr) : ((((per > 0 && hv < pherb) || per == 0) && ((phr * hv) <= pdm || pdm == 0)) ? (phr * hv) : ((per > 0 && hv >= pherb && ((phr * hv) + (hv - pherb + 1) * (per - phr) <= pdm || pdm == 0)) ? (phr * hv) + (hv - pherb + 1) * (per - phr) : pdm)))))))));
    }

    getCalcuationByZone(zone: EscalatingZone) {
        var thd = zone.escalatingOperatingHourDaily.totalHours; //$D$53 //TotalHours Daily
        var the = zone.escalatingOperatingHourEvening.totalHours; //$D$53 //TotalHours Daily

        var pcnphv = 0;//Prev Calculated NonPeak Hourly value
        var pcphv = 0;//Prev Calculated Peak Hourly value
        var hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        const flatRate = zone.escalatingOperatingHourEvening.totalHours;//5;
        var eveningRate = (the / flatRate);
        var calculations = {
            eveningRate: isNaN(eveningRate) ? 0 : eveningRate, //G20
            nonPeakRates: [],//H20
            nonPeakRate: 0,
            nonPeakTotal: 0,

            peakRates: [],//I19
            peakTotal: 0,//I19
            peakRate: 0,
        }

        var percentValue = thd;
        var hourlyPercentValues = zone.dailyHourlyPercentValuesList;
        hours.forEach(hv => {
            percentValue = 0;
            var hourlyPercent = hourlyPercentValues.find(x => x.hour == hv);
            if (hourlyPercent != null) percentValue = hourlyPercent.percent;

            pcnphv = this.getNonPeakValue(pcnphv, hv, zone);
            pcphv = this.getPeakValue(pcphv, hv, zone);
            var nonPeakPercentVal = hv < (thd + 1) ? 1 / thd : 0;
            var npRate = thd / hv;
            console.log(pcnphv, nonPeakPercentVal, npRate);
            calculations.nonPeakRates.push(pcnphv * nonPeakPercentVal * npRate);

            var peakPercentVal = hv < (percentValue + 1) ? 1 / percentValue : 0;
            var pRate = thd / hv;
            console.log(pcphv * peakPercentVal * pRate);
            calculations.peakRates.push(pcphv * peakPercentVal * pRate);
        });
        console.log(calculations);
        calculations.nonPeakRate = (1 * zone.nonPeakEveningFlatRate * calculations.eveningRate);//H20
        calculations.nonPeakRates.forEach(x => { calculations.nonPeakTotal += x });

        calculations.peakRate = (1 * zone.peakEveningFlatRate * calculations.eveningRate);//H20
        calculations.peakRates.forEach(x => { calculations.peakTotal += x });

        // var daysPerYear = zone.operatingDays.daysPerYear;
        var daysPerYear = (zone.operatingDays.daysPerYear - zone.operatingDays.offDays);
        var nonPeakRevenue = (calculations.nonPeakTotal + calculations.nonPeakRate) * zone.numberOfSpacesRemaining * daysPerYear * (zone.compliancePercentage / 100) * (zone.nonPeakOccupancyPercentage / 100);
        var peakRevenue = (calculations.peakTotal + calculations.peakRate) * zone.numberOfSpacesRemaining * zone.operatingDays.peakDays * (zone.compliancePercentage / 100) * (zone.peakOccupancyPercentage / 100) +
            (calculations.nonPeakTotal + calculations.nonPeakRate) * zone.numberOfSpacesRemaining * zone.operatingDays.nonPeakDays * (zone.compliancePercentage / 100) * (zone.nonPeakOccupancyPercentage / 100);
        return {
            nonPeak: nonPeakRevenue,
            peak: peakRevenue,
        }
    }

    setHourlyPercentValues(dailyHourlyPercentValues: Array<HourlyPercentValue>, totalHours: number) {
        var totalUsedPercent = 0, startFrom = 3;
        dailyHourlyPercentValues.forEach((x, index) => {
            if (index >= 3)
                x.percent = 0;
            else
                totalUsedPercent += x.percent;
        });
        var remainingPercent = (100 - totalUsedPercent);
        var resetValue = remainingPercent / (totalHours - startFrom);
        dailyHourlyPercentValues.forEach((x) => {
            if (x.hour > startFrom && x.hour <= totalHours) x.percent = resetValue;
        });
    }
    // End : Escalating Model Revenue calculations logic

    getCalculatedDaysPerYear(operatingDays: OperatingDays, dayName: string = "NonPeakDays") {
        let daysPerYear = 365;
        operatingDays.daysPerYear = daysPerYear;
        switch (dayName) {
            case "OffDays":
                operatingDays.offDays = operatingDays.offDays < 0 ? 0 : operatingDays.offDays;

                if (this.isPeakSeasonPricing) {
                    var maxNonPeakDays = (daysPerYear - operatingDays.peakDays);
                    operatingDays.offDays = operatingDays.offDays > maxNonPeakDays ? maxNonPeakDays : operatingDays.offDays;

                    operatingDays.nonPeakDays = daysPerYear - (operatingDays.peakDays + operatingDays.offDays);
                } else {
                    operatingDays.peakDays = 0;

                    operatingDays.offDays = operatingDays.offDays > daysPerYear ? daysPerYear : operatingDays.offDays;

                    operatingDays.nonPeakDays = daysPerYear - Math.abs(operatingDays.peakDays + operatingDays.offDays);
                }
                break;
            case "NonPeakDays":
            default:
                operatingDays.nonPeakDays = operatingDays.nonPeakDays < 0 ? 0 : operatingDays.nonPeakDays;

                if (this.isPeakSeasonPricing) {
                    var maxNonPeakDays = (daysPerYear - operatingDays.offDays);
                    operatingDays.nonPeakDays = operatingDays.nonPeakDays > maxNonPeakDays ? maxNonPeakDays : operatingDays.nonPeakDays;

                    operatingDays.peakDays = daysPerYear - (operatingDays.offDays + operatingDays.nonPeakDays);
                } else {
                    operatingDays.peakDays = 0;

                    operatingDays.nonPeakDays = operatingDays.nonPeakDays > daysPerYear ? daysPerYear : operatingDays.nonPeakDays;

                    operatingDays.offDays = daysPerYear - Math.abs(operatingDays.peakDays + operatingDays.nonPeakDays);
                }
                break;
        }
        return operatingDays;
    }

}
