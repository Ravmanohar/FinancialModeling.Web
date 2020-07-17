import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FinancialDashboardService } from 'src/app/components/financial-dashboard/financial-dashboard.service';
import { FinancialDashboardDto } from 'src/app/components/financial-dashboard/financial-dashboard.models';

import { SetupTimeOfDayModelDto, TimeOfDayZone, TimeOfDayOperatingHour } from 'src/app/models/setup.model.index';
import { BusinessService } from 'src/app/services/business.service';
import { ProjectedRevenueSummary } from 'src/app/models/common.models';
import { SetupModelService } from 'src/app/services/setup-model.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActionType } from 'src/app/models/enums';
import { LookupService } from 'src/app/services';

declare var $;
declare var moment;
declare var toastr;
@Component({
  selector: 'app-timeofday-model',
  templateUrl: './timeofday-model.component.html',
  styleUrls: ['./timeofday-model.component.scss']
})
export class TimeofdayModelComponent implements OnInit {
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

  addTimeSlot: any = {};
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
        console.log(commandName);
        switch (commandName) {
          case "UpdateModel":
            this.updateTimeOfDayModel();
            break;
          default:
            break;
        }
      });
    }
    this.locationName = this.locationTypes[this.modelName];
    this.loadTimeOfDayModelByLocationType();
  }

  ngOnDestroy() {
    if (this.onParentCommandSubscription != null)
      this.onParentCommandSubscription.unsubscribe()
  }

  updateTimeOfDayModel() {
    console.log(this.timeOfDayModel);
    this.isShowLoader = true;
    this.setupModelService.updateTimeOfDayModel(this.timeOfDayModel)
      .subscribe((timeOfDayModel: SetupTimeOfDayModelDto) => {
        this.timeOfDayModel = timeOfDayModel;
        this.isShowLoader = false;
        toastr.success("Successfully Updated Model.", "Success");

        this.onChildAction.emit("onModelUpdated");
      }, (errorResponse: HttpErrorResponse) => {
        toastr.error("Failed To Update Model.", "Error");
        this.isShowLoader = false;
      });
  }

  isValidTimeSlot() {
    let isValid: boolean = this.addTimeSlot.startTime != null && this.addTimeSlot.endTime != null;
    if (!isValid) {
      toastr.error("Please Select Start and End Time.", "Error");
      return false;
    } else {
      var startTime = moment(this.addTimeSlot.startTime, 'h:mma');
      var endTime = moment(this.addTimeSlot.endTime, 'h:mma');
      if (startTime > endTime) {
        toastr.error("End Time must be greater than Start Time", "Error");
        return false;
      }
    }
    return isValid;
  }

  onAddTimeSlot() {
    console.log(this.addTimeSlot);
    if (this.isValidTimeSlot()) {
      let hoursOfOperation: TimeOfDayOperatingHour = new TimeOfDayOperatingHour();
      hoursOfOperation.operatingHoursStart = this.addTimeSlot.startTime;
      hoursOfOperation.operatingHoursEnd = this.addTimeSlot.endTime;
      hoursOfOperation.totalHours = this.businessService.getTotalHours(hoursOfOperation.operatingHoursStart, hoursOfOperation.operatingHoursEnd);
      hoursOfOperation.operatingHoursStart = this.businessService.getFormattedTime(hoursOfOperation.operatingHoursStart);
      hoursOfOperation.operatingHoursEnd = this.businessService.getFormattedTime(hoursOfOperation.operatingHoursEnd);
      hoursOfOperation.actionType = ActionType.Created;
      this.selectedZone.hoursOfOperations.push(hoursOfOperation);
    }
  }

  deletedActionType: number = ActionType.Deleted;
  onRemoveTimeSlot(hoursOfOperation: TimeOfDayOperatingHour, removeIndex: number) {
    if (hoursOfOperation.id == 0)
      this.selectedZone.hoursOfOperations.splice(removeIndex, 1);
    else
      hoursOfOperation.actionType = ActionType.Deleted;
  }

  projectedRevenueSummary: ProjectedRevenueSummary = null;
  isShowLoader: boolean = false;
  timeOfDayModel: SetupTimeOfDayModelDto = null;
  loadTimeOfDayModelByLocationType() {
    switch (this.modelName) {
      case "timeOfDayOnStreet":
        this.timeOfDayModel = this.financialDashboard.timeOfDayOnStreet;
        break;
      case "timeOfDayOffStreet":
        this.timeOfDayModel = this.financialDashboard.timeOfDayOffStreet;
        break;
      case "timeOfDayGarages":
        this.timeOfDayModel = this.financialDashboard.timeOfDayGarages;
        break;
      default:
        break;
    }
    console.log("timeOfDayModel", this.timeOfDayModel);
    this.timeOfDayModel = this.businessService.getTimeOfDayModel(this.timeOfDayModel);

    if (this.calculateYearlyRevenue) {
      this.projectedRevenueSummary = this.businessService.getProjectedRevenueSummaryTimeOfDayRateModel(this.timeOfDayModel);
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

  onTimeChange($event: any, hoursOfOperation: TimeOfDayOperatingHour) {
    hoursOfOperation.totalHours = this.businessService.getTotalHours(hoursOfOperation.operatingHoursStart, hoursOfOperation.operatingHoursEnd);
  }

  selectedZone: TimeOfDayZone = new TimeOfDayZone();
  lastPageNumber: number = 0;
  selectedPage: number = 1;
  setDefaultFirstPage() {
    this.lastPageNumber = this.timeOfDayModel.timeOfDayZones.length;
    this.selectedZone = this.timeOfDayModel.timeOfDayZones[this.selectedPage - 1];
    this.selectedZone.isModified = true;
  }

  onNext() {
    var nextPage = this.selectedPage + 1;
    nextPage = nextPage > this.lastPageNumber ? this.lastPageNumber : nextPage;
    this.selectedPage = nextPage;

    this.selectedZone = this.timeOfDayModel.timeOfDayZones[this.selectedPage - 1];
    this.selectedZone.isModified = true;
  }

  onPrevious() {
    var previousPage = this.selectedPage - 1;
    previousPage = previousPage < 0 ? 1 : previousPage;
    this.selectedPage = previousPage;

    this.selectedZone = this.timeOfDayModel.timeOfDayZones[this.selectedPage - 1];
    this.selectedZone.isModified = true;
  }

  // onSaveAsModel() {
  //   console.log(this.timeOfDayModel);
  //   this.changeDetector.detectChanges();
  // }

  onApply() {
    console.log(this.timeOfDayModel);
    this.projectedRevenueSummary = this.businessService.getProjectedRevenueSummaryTimeOfDayRateModel(this.timeOfDayModel);
    console.log(this.projectedRevenueSummary);
    this.changeDetector.detectChanges();
  }

  onToggleWizardContent($event) {
    $("#timeofday-wizard-content").slideToggle(1000);
  }


}