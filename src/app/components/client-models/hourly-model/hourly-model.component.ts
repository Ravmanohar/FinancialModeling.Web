import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { FinancialDashboardService } from 'src/app/components/financial-dashboard/financial-dashboard.service';
import { FinancialDashboardDto } from 'src/app/components/financial-dashboard/financial-dashboard.models';

import { SetupHourlyModelDto, HourlyZone } from 'src/app/models/setup.model.index';
import { BusinessService } from 'src/app/services/business.service';
import { ProjectedRevenueSummary } from 'src/app/models/common.models';
import { SetupModelService } from 'src/app/services/setup-model.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LookupService } from 'src/app/services';

declare var $;
declare var moment;
declare var toastr;
@Component({
  selector: 'app-hourly-model',
  templateUrl: './hourly-model.component.html',
  styleUrls: ['./hourly-model.component.scss'],
})
export class HourlyModelComponent implements OnInit {
  @Input() private onParentCommand: EventEmitter<string>;
  @Input() public calculateYearlyRevenue: boolean = null;

  @Output() onChildAction: EventEmitter<string> = new EventEmitter();

  @Input() private modelName: string;
  @Input() private financialDashboard: FinancialDashboardDto;
  constructor(
    public financialDashboardService: FinancialDashboardService,
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
            this.updateHourlyModel();
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

  updateHourlyModel() {
    console.log(this.hourlyModel);
    this.isShowLoader = true;
    this.setupModelService.updateHourlyModel(this.hourlyModel)
      .subscribe((hourlyModel: SetupHourlyModelDto) => {
        this.hourlyModel = hourlyModel;
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
  hourlyModel: SetupHourlyModelDto = null;
  loadHourlyModelByLocationType() {
    switch (this.modelName) {
      case "hourlyOnStreet":
        this.hourlyModel = this.financialDashboard.hourlyOnStreet;
        break;
      case "hourlyOffStreet":
        this.hourlyModel = this.financialDashboard.hourlyOffStreet;
        break;
      case "hourlyGarages":
        this.hourlyModel = this.financialDashboard.hourlyGarages;
        break;
      default:
        break;
    }

    console.log(this.hourlyModel);
    this.hourlyModel = this.businessService.getHourlyModel(this.hourlyModel);

    if (this.calculateYearlyRevenue) {
      this.projectedRevenueSummary = this.businessService.getProjectedRevenueSummaryHourlyRateModel(this.hourlyModel);
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
    this.selectedZone.hourlyOperatingHour.totalHours = this.businessService.getTotalHours(this.selectedZone.hourlyOperatingHour.startTime, this.selectedZone.hourlyOperatingHour.endTime);
  }

  selectedZone: HourlyZone = new HourlyZone();
  lastPageNumber: number = 0;
  selectedPage: number = 1;
  setDefaultFirstPage() {
    this.lastPageNumber = this.hourlyModel.hourlyZones.length;
    this.selectedZone = this.hourlyModel.hourlyZones[this.selectedPage - 1];
    this.selectedZone.isModified = true;
  }

  onNext() {
    var nextPage = this.selectedPage + 1;
    nextPage = nextPage > this.lastPageNumber ? this.lastPageNumber : nextPage;
    this.selectedPage = nextPage;

    this.selectedZone = this.hourlyModel.hourlyZones[this.selectedPage - 1];
    this.selectedZone.isModified = true;
  }

  onPrevious() {
    var previousPage = this.selectedPage - 1;
    previousPage = previousPage < 0 ? 1 : previousPage;
    this.selectedPage = previousPage;

    this.selectedZone = this.hourlyModel.hourlyZones[this.selectedPage - 1];
    this.selectedZone.isModified = true;
  }

  // onSaveAsModel() {
  //   console.log(this.hourlyModel);
  //   this.changeDetector.detectChanges();
  // }

  onApply() {
    console.log(this.hourlyModel);
    this.projectedRevenueSummary = this.businessService.getProjectedRevenueSummaryHourlyRateModel(this.hourlyModel);
    this.changeDetector.detectChanges();
  }

  onToggleWizardContent($event) {
    $("#hourly-wizard-content").slideToggle(1000);
  }

}