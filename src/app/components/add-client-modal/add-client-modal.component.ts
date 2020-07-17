import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AddClientModel } from 'src/app/models';
import { AddPermitModel, AddZoneModel, ParkingClientModel } from 'src/app/models/add-client-model';

import { AdminService, LookupService } from 'src/app/services';
import { HttpErrorResponse } from '@angular/common/http';
import { ActionType } from 'src/app/models/enums';
import { FinancialDashboardDto } from 'src/app/models/setup.model.index';
import { FinancialDashboardService } from '../financial-dashboard/financial-dashboard.service';

declare var $;
declare var toastr;

@Component({
  selector: 'app-add-client-modal',
  templateUrl: './add-client-modal.component.html',
  styleUrls: ['./add-client-modal.component.scss']
})
export class AddClientModalComponent implements OnInit {
  @Input() public isEditClientModal: boolean;
  // @Input() private editClientModel: AddClientModel = null;
  @Input() private financialDashboard: FinancialDashboardDto = null;

  @Output() onClientCreated: EventEmitter<ParkingClientModel> = new EventEmitter();
  @Output() onClientUpdated: EventEmitter<ParkingClientModel> = new EventEmitter();

  constructor(
    private adminService: AdminService,
    private lookupService: LookupService,
  ) { }

  addClientModel: AddClientModel = new AddClientModel();
  zonePropertyNames: Array<string> = ["onStreetZones", "offStreetZones", "garagesZones"];
  permitPropertyNames: Array<string> = ["onStreetPermits", "offStreetPermits", "garagesPermits"];
  deletedActionType: number = ActionType.Deleted;

  parkingTypevailability: any = {
    "onStreetZones": true,
    "offStreetZones": true,
    "garagesZones": true,
    "onStreetPermits": true,
    "offStreetPermits": true,
    "garagesPermits": true,
  }

  editClientModel: AddClientModel = null;
  ngOnInit() {
    if (this.isEditClientModal) {
      this.editClientModel = this.financialDashboard.editClientModel;
      this.addClientModel = JSON.parse(JSON.stringify(this.editClientModel));

      for (var parkingType of this.lookupService.parkingTypes) {
        let isAvailable: boolean = false;
        switch (parkingType) {
          case "onStreet":
            isAvailable = this.financialDashboard.hourlyOnStreet.isAvailable || this.financialDashboard.timeOfDayOnStreet.isAvailable || this.financialDashboard.escalatingOnStreet.isAvailable;
            this.parkingTypevailability.onStreetZones = isAvailable;
            this.parkingTypevailability.onStreetPermits = isAvailable;
            break;
          case "offStreet":
            isAvailable = this.financialDashboard.hourlyOffStreet.isAvailable || this.financialDashboard.timeOfDayOffStreet.isAvailable || this.financialDashboard.escalatingOffStreet.isAvailable;
            this.parkingTypevailability.offStreetZones = isAvailable;
            this.parkingTypevailability.offStreetPermits = isAvailable;
            break;
          case "garages":
            isAvailable = this.financialDashboard.hourlyGarages.isAvailable || this.financialDashboard.timeOfDayGarages.isAvailable || this.financialDashboard.escalatingGarages.isAvailable;
            this.parkingTypevailability.garagesZones = isAvailable;
            this.parkingTypevailability.garagesPermits = isAvailable;
            break;
        }
      }
    }
    else {
      this.addClientModel = new AddClientModel();
      this.permitPropertyNames.forEach((propertyName: string) => {
        this.onAddPermit(propertyName, "Permit 1");
      });
      this.zonePropertyNames.forEach((propertyName: string) => {
        this.onAddZone(propertyName, "Zone 1");
      });
    }
  }

  showAddClientPopup() {
    $("#add-client-modal").modal('show');
  }

  closeAddClientPopup() {
    $("#add-client-modal").modal('hide');
  }

  onAddPermit(propertyName: string, permitName: string = "") {
    let addPermitModel: AddPermitModel = new AddPermitModel();
    addPermitModel.permitName = permitName;
    this.addClientModel[propertyName].push(addPermitModel);
  }
  onRemovePermit(propertyName: string, removeIndex: number) {
    if (this.addClientModel[propertyName][removeIndex].permitCode == 0)
      this.addClientModel[propertyName].splice(removeIndex, 1);
    else
      this.addClientModel[propertyName][removeIndex].actionType = ActionType.Deleted;
  }

  onAddZone(propertyName: string, zoneName: string = "") {
    let addZoneModel: AddZoneModel = new AddZoneModel();
    addZoneModel.zoneName = zoneName;
    this.addClientModel[propertyName].push(addZoneModel);
  }
  onRemoveZone(propertyName: string, removeIndex: number) {
    if (this.addClientModel[propertyName][removeIndex].zoneCode == 0)
      this.addClientModel[propertyName].splice(removeIndex, 1);
    else
      this.addClientModel[propertyName][removeIndex].actionType = ActionType.Deleted;
  }

  isSaving: boolean = false;
  onClientAdd() {
    console.log(this.addClientModel);
    this.isSaving = true;
    if (this.validateZones() == false) {
      this.isSaving = false;
      return false;
    }
    if (!this.isEditClientModal) {
      this.adminService.setupClient(this.addClientModel)
        .subscribe((parkingClientModel: ParkingClientModel) => {
          this.onClientCreated.emit(parkingClientModel);
          this.isSaving = false;
          this.closeAddClientPopup();
          toastr.success('Client added successfully', "Success");
        }, (errorResponse: HttpErrorResponse) => {
          this.isSaving = false;
          toastr.error('Failed to add Client', "Error");
        });
    } else {
      console.log("Call Update API");
      this.adminService.updateClient(this.addClientModel)
        .subscribe((parkingClientModel: ParkingClientModel) => {
          this.onClientUpdated.emit(parkingClientModel);
          this.isSaving = false;
          this.closeAddClientPopup();
          toastr.success('Client updated successfully', "Success");
        }, (errorResponse: HttpErrorResponse) => {
          this.isSaving = false;
          toastr.error('Failed to updated Client', "Error");
        });
    }
  }

  onKeyPressValidateNumber(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 47 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  isFirstPage: boolean = true;
  wizardPageNumber: number = 1;
  maxPages: number = 3;
  lables: any = {
    "onStreetPermits": "On-Street",
    "offStreetPermits": "Off-Street",
    "garagesPermits": "Garages",

    "onStreetZones": "On-Street",
    "offStreetZones": "Off-Street",
    "garagesZones": "Garages",
  };

  onPeakSeaonPricing() {
    this.addClientModel.isPeakSeasonPricing = !this.addClientModel.isPeakSeasonPricing;
  }
  onHavePermits() {
    this.addClientModel.havePermits = !this.addClientModel.havePermits;
  }

  validateClientName() {
    if (this.addClientModel.clientName == null || this.addClientModel.clientName.trim() == "") {
      toastr.error("Please enter Client Name.", "Validation Error");
      return false;
    }
  }

  validateZones() {
    if (this.addClientModel.onStreetZones.length == 0) {
      toastr.error('Please add zone in On Street.', "Error");
      return false;
    }
    if (this.addClientModel.onStreetZones.find((z: AddZoneModel) => z.actionType != ActionType.Deleted && z.zoneName.trim() == "")) {
      toastr.error('Please add zone names for all On Street.', "Error");
      return false;
    }

    if (this.addClientModel.offStreetZones.length == 0) {
      toastr.error('Please add zone in Off Street.', "Error");
      return false;
    }
    if (this.addClientModel.offStreetZones.find((z: AddZoneModel) => z.actionType != ActionType.Deleted && z.zoneName.trim() == "")) {
      toastr.error('Please add zone names for all Off Street.', "Error");
      return false;
    }

    if (this.addClientModel.garagesZones.length == 0) {
      toastr.error('Please add zone in Garages.', "Error");
      return false;
    }
    if (this.addClientModel.garagesZones.find((z: AddZoneModel) => z.actionType != ActionType.Deleted && z.zoneName.trim() == "")) {
      toastr.error('Please add zone names for all Garages.', "Error");
      return false;
    }
    return true;
  }

  validatePermits() {
    if (this.addClientModel.onStreetPermits.length == 0) {
      toastr.error('Please add permit in On Street.', "Error");
      return false;
    }
    if (this.addClientModel.onStreetPermits.find((p: AddPermitModel) => p.actionType != ActionType.Deleted && p.permitName.trim() == "")) {
      toastr.error('Please add permit name for On Street.', "Error");
      return false;
    }

    if (this.addClientModel.offStreetPermits.length == 0) {
      toastr.error('Please add permit in Off Street.', "Error");
      return false;
    }
    if (this.addClientModel.offStreetPermits.find((p: AddPermitModel) => p.actionType != ActionType.Deleted && p.permitName.trim() == "")) {
      toastr.error('Please add permit name for Off Street.', "Error");
      return false;
    }

    if (this.addClientModel.garagesPermits.length == 0) {
      toastr.error('Please add permit in Garages.', "Error");
      return false;
    }
    if (this.addClientModel.garagesPermits.find((p: AddPermitModel) => p.actionType != ActionType.Deleted && p.permitName.trim() == "")) {
      toastr.error('Please add permit name for Garages.', "Error");
      return false;
    }
  }

  onPrevious() {
    this.isFirstPage = true;

    let prevPage: number = this.wizardPageNumber - 1;
    this.wizardPageNumber = this.wizardPageNumber < 1 ? 1 : prevPage;
    $("#body-content").animate({ scrollTop: 0 }, 500);
  }

  onNext() {
    if (this.wizardPageNumber == 1) {
      if (this.validateClientName() == false)
        return false;
    }
    if (this.wizardPageNumber == 2) {
      if (this.validatePermits() == false)
        return false;
    }
    let nextPage: number = this.wizardPageNumber + 1;
    this.wizardPageNumber = nextPage > this.maxPages ? this.maxPages : nextPage;
    $("#body-content").animate({ scrollTop: 0 }, 500);
  }
}