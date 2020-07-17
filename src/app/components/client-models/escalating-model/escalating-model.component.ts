import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FinancialDashboardService } from 'src/app/components/financial-dashboard/financial-dashboard.service';
import { FinancialDashboardDto } from 'src/app/components/financial-dashboard/financial-dashboard.models';

import { SetupHourlyModelDto, HourlyZone } from 'src/app/models/setup.model.index';
import { BusinessService } from 'src/app/services/business.service';
import { SetupEscalatingModelDto, EscalatingZone, HourlyPercentValue } from 'src/app/models/setup-escalating-model';
import { ProjectedRevenueSummary } from 'src/app/models/common.models';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { SetupModelService } from 'src/app/services/setup-model.service';
import { LookupService } from 'src/app/services';

declare var $;
declare var moment;
declare var toastr;
@Component({
  selector: 'app-escalating-model',
  templateUrl: './escalating-model.component.html',
  styleUrls: ['./escalating-model.component.scss']
})
export class EscalatingModelComponent implements OnInit {
  @Input() private onParentCommand: EventEmitter<string>;
  @Input() public calculateYearlyRevenue: boolean = null;

  @Output() onChildAction: EventEmitter<string> = new EventEmitter();

  @Input() private modelName: string;
  @Input() private financialDashboard: FinancialDashboardDto;
  constructor(
    private financialDashboardService: FinancialDashboardService,
    private changeDetector: ChangeDetectorRef,
    private setupModelService: SetupModelService,
    public lookupService: LookupService,
    private businessService: BusinessService) {

  }

  locationTypes: any = {
    hourlyOnStreet: "ON-STREET",
    hourlyOffStreet: "OFF-STREET",
    hourlyGarages: "GARAGES",
  }
  locationName: string = "";

  isProjectionChanged: boolean = false;
  onParentCommandSubscription: any = null;
  disablePeak: boolean = false;
  isPeakSeasonPricing: boolean = false;
  hasPermits: boolean = true;
  ngOnInit() {
    console.log(this.financialDashboard);
    this.businessService.setGlobals(this.financialDashboard);
    this.isPeakSeasonPricing = this.financialDashboard.editClientModel.isPeakSeasonPricing;
    this.disablePeak = !this.isPeakSeasonPricing;
    this.hasPermits = this.financialDashboard.editClientModel.havePermits;
    if (this.onParentCommand) {
      this.onParentCommandSubscription = this.onParentCommand.subscribe(commandName => {
        switch (commandName) {
          case "UpdateModel":
            this.updateEscalatingModel();
            break;
          default:
            break;
        }
      });
    }
    this.locationName = this.locationTypes[this.modelName];
    this.loadHourlyModelByLocationType();
  }

  ngOnDestroy() {
    if (this.onParentCommandSubscription != null)
      this.onParentCommandSubscription.unsubscribe()
  }

  updateEscalatingModel() {
    console.log(this.escalatingModel);
    this.isShowLoader = true;
    this.setupModelService.updateEscalatingModel(this.escalatingModel)
      .subscribe((escalatingModel: SetupEscalatingModelDto) => {
        this.escalatingModel = escalatingModel;
        this.isShowLoader = false;
        toastr.success("Successfully Updated Model.", "Success");

        this.onChildAction.emit("onModelUpdated");
      }, (errorResponse: HttpErrorResponse) => {
        toastr.error("Failed To Update Model.", "Error");
        this.isShowLoader = false;
      });
  }

  projectedRevenueSummary: ProjectedRevenueSummary = null;
  isShowLoader: boolean = false;
  escalatingModel: SetupEscalatingModelDto = null;
  loadHourlyModelByLocationType() {
    switch (this.modelName) {
      case "escalatingOnStreet":
        this.escalatingModel = this.financialDashboard.escalatingOnStreet;
        break;
      case "escalatingOffStreet":
        this.escalatingModel = this.financialDashboard.escalatingOffStreet;
        break;
      case "escalatingGarages":
        this.escalatingModel = this.financialDashboard.escalatingGarages;
        break;
      default:
        break;
    }
    console.log(this.escalatingModel);
    this.escalatingModel = this.businessService.getEscalatingModel(this.escalatingModel);
    if (this.calculateYearlyRevenue) {
      this.projectedRevenueSummary = this.businessService.getProjectedRevenueSummaryEscalatingRateModel(this.escalatingModel);
      console.log(this.projectedRevenueSummary);
    }

    //Service call to set all properties
    this.setDefaultFirstPage();
  }

  onDayChange($event: any, dayName: string) {
    this.selectedZone.operatingDays = this.businessService.getCalculatedDaysPerYear(this.selectedZone.operatingDays, dayName);
  }


  onSpaceChange($event: any) {
    this.selectedZone.numberOfSpacesRemaining = this.businessService.getNumberOfSpacesRemaining(this.selectedZone.numberOfSpacesPerZone, this.selectedZone.percentOfSpaceOccupied);
  }

  onTimeChange($event: any) {
    this.selectedZone.escalatingOperatingHourDaily.totalHours = this.businessService.getTotalHours(this.selectedZone.escalatingOperatingHourDaily.startTime, this.selectedZone.escalatingOperatingHourDaily.endTime);
    this.selectedZone.escalatingOperatingHourEvening.totalHours = this.businessService.getTotalHours(this.selectedZone.escalatingOperatingHourEvening.startTime, this.selectedZone.escalatingOperatingHourEvening.endTime);
  }

  selectedZone: EscalatingZone = new EscalatingZone();
  lastPageNumber: number = 0;
  selectedPage: number = 1;
  setDefaultFirstPage() {
    this.lastPageNumber = this.escalatingModel.escalatingZones.length;
    this.selectedZone = this.escalatingModel.escalatingZones[this.selectedPage - 1];
    this.selectedZone.isModified = true;
  }

  onNext() {
    var nextPage = this.selectedPage + 1;
    nextPage = nextPage > this.lastPageNumber ? this.lastPageNumber : nextPage;
    this.selectedPage = nextPage;

    this.selectedZone = this.escalatingModel.escalatingZones[this.selectedPage - 1];
    this.selectedZone.isModified = true;
  }

  onPrevious() {
    var previousPage = this.selectedPage - 1;
    previousPage = previousPage < 0 ? 1 : previousPage;
    this.selectedPage = previousPage;

    this.selectedZone = this.escalatingModel.escalatingZones[this.selectedPage - 1];
    this.selectedZone.isModified = true;
  }

  // onSaveAsModel() {
  //   console.log(this.escalatingModel);
  //   this.changeDetector.detectChanges();
  // }

  onApply() {
    console.log(this.escalatingModel);
    this.projectedRevenueSummary = this.businessService.getProjectedRevenueSummaryEscalatingRateModel(this.escalatingModel);
    this.changeDetector.detectChanges();
  }

  onToggleWizardContent($event) {
    $("#escalating-wizard-content").slideToggle(1000);
  }

  //Start : Hourly Percent Value Calculation Logic
  dailyHourlyPercentValues: Array<HourlyPercentValue> = new Array<HourlyPercentValue>();
  onKeyDown($event) {
    var key = $event.charCode || $event.keyCode || 0;
    // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
    // home, end, period, and numpad decimal
    return (key == 8 || key == 9 || key == 13 || key == 46 || key == 110 || key == 190 || (key >= 35 && key <= 40) ||
      (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
  }
  onHourlyPercentInput($event: any, hour: number) {
    $event.preventDefault();
    var hour1 = this.dailyHourlyPercentValues.find(x => x.hour == 1);
    var hour2 = this.dailyHourlyPercentValues.find(x => x.hour == 2);
    var hour3 = this.dailyHourlyPercentValues.find(x => x.hour == 3);
    var top3HoursTotalPecent = 0;
    var percentValue = Number($event.target.value);
    var totalHoursDaily = 10;
    switch (hour) {
      case 1:
        top3HoursTotalPecent = percentValue + hour2.percent + hour3.percent;
        if (percentValue < hour1.percent || top3HoursTotalPecent <= 100) {
          hour1.percent = percentValue;
        } else {
          $event.target.value = hour1.percent;
        }
        this.businessService.setHourlyPercentValues(this.dailyHourlyPercentValues, totalHoursDaily);
        break;
      case 2:
        top3HoursTotalPecent = percentValue + hour1.percent + hour3.percent;
        if (percentValue < hour2.percent || top3HoursTotalPecent <= 100) {
          hour2.percent = percentValue;
        } else {
          $event.target.value = hour2.percent;
        }
        this.businessService.setHourlyPercentValues(this.dailyHourlyPercentValues, totalHoursDaily);
        break;
      case 3:
        top3HoursTotalPecent = percentValue + hour1.percent + hour2.percent;
        if (percentValue < hour3.percent || top3HoursTotalPecent <= 100) {
          hour3.percent = percentValue;
        } else {
          $event.target.value = hour3.percent;
        }
        this.businessService.setHourlyPercentValues(this.dailyHourlyPercentValues, totalHoursDaily);
        break;
    }
  }
  isShowDailyHoulyPercentModal: boolean = false;
  onShowDailyHoulyPercentModal() {
    this.businessService.setHourlyPercentValues(this.selectedZone.dailyHourlyPercentValuesList, this.selectedZone.escalatingOperatingHourDaily.totalHours);
    this.dailyHourlyPercentValues = this.selectedZone.dailyHourlyPercentValuesList;
    console.log(this.dailyHourlyPercentValues);
    this.isShowDailyHoulyPercentModal = true;
  }
  onHideDailyHoulyPercentModal() {
    this.isShowDailyHoulyPercentModal = false;
    this.selectedZone.dailyHourlyPercentValuesJson = JSON.stringify(this.selectedZone.dailyHourlyPercentValuesList);
  }
  //End : Hourly Percent Value Calculation Logic
}
