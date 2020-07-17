import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AdminService, LookupService, AuthenticationService } from 'src/app/services';
import { HttpErrorResponse } from '@angular/common/http';
import { FinancialDashboardDto } from 'src/app/components/financial-dashboard/financial-dashboard.models';
import { ParkingClientModel, ClientModelDto } from 'src/app/models/add-client-model';
import { SetupModelService } from 'src/app/services/setup-model.service';

declare var $;
declare var toastr;
@Component({
  selector: 'app-setup-model-tab',
  templateUrl: './setup-model-tab.component.html',
  styleUrls: ['./setup-model-tab.component.scss']
})
export class SetupModelTabComponent implements OnInit {

  @Output() onModelCreated: EventEmitter<string> = new EventEmitter();

  constructor(
    public lookupService: LookupService,
    public adminService: AdminService,
    public authService: AuthenticationService,
    public setupModelService: SetupModelService,
  ) {
  }

  parkingClientModel: ParkingClientModel = new ParkingClientModel();
  private onParentCommand: EventEmitter<string> = new EventEmitter();
  ngOnInit() {
    this.parkingClientModel = JSON.parse(localStorage.getItem('CurrentClient'));
    console.log("clientInfo :", this.parkingClientModel);
    this.getClientModels();
  }

  getClientById() {
    this.adminService.getClientById(this.parkingClientModel.clientId)
      .subscribe((parkingClientModel: ParkingClientModel) => {
        console.log(parkingClientModel);
        this.parkingClientModel = parkingClientModel;
      }, (errorResponse: HttpErrorResponse) => { });
  }

  isShowLoader: boolean = false;
  financialDashboard: FinancialDashboardDto = new FinancialDashboardDto();
  propertyNames: Array<string> = this.lookupService.propertyNames;
  modelTypeLables: any = this.lookupService.modelTypeLables;

  getClientModels() {
    this.getClientById();

    console.log(this.financialDashboard);
    this.isShowLoader = true;
    let clientId: number = this.parkingClientModel.clientId;
    this.adminService.getClientInfo(clientId)
      .subscribe((financialDashboard: FinancialDashboardDto) => {
        console.log(financialDashboard);
        this.isShowEditClient = true;
        this.financialDashboard = financialDashboard;
        this.isShowLoader = false;

        this.updateEquipmentCostTabButtonsAvailability();

      }, (errorResponse: HttpErrorResponse) => {
        toastr.error("Get Client Models", "Error");
      });
  }

  updateEquipmentCostTabButtonsAvailability() {
    this.parkingTypes.forEach(parkingType => {
      parkingType.isAvailable = false;
    });
    for (var parkingType of this.lookupService.parkingTypes) {
      let isAvailable: boolean = false;
      switch (parkingType) {
        case "onStreet":
          isAvailable = this.financialDashboard.hourlyOnStreet.isAvailable || this.financialDashboard.timeOfDayOnStreet.isAvailable || this.financialDashboard.escalatingOnStreet.isAvailable;
          this.parkingTypes.find(x => x.parkingTypeId == 1).isAvailable = isAvailable;
          break;
        case "offStreet":
          isAvailable = this.financialDashboard.hourlyOffStreet.isAvailable || this.financialDashboard.timeOfDayOffStreet.isAvailable || this.financialDashboard.escalatingOffStreet.isAvailable;
          this.parkingTypes.find(x => x.parkingTypeId == 2).isAvailable = isAvailable;
          break;
        case "garages":
          isAvailable = this.financialDashboard.hourlyGarages.isAvailable || this.financialDashboard.timeOfDayGarages.isAvailable || this.financialDashboard.escalatingGarages.isAvailable;
          this.parkingTypes.find(x => x.parkingTypeId == 3).isAvailable = isAvailable;
          break;
      }
    }
  }

  isShowModal: boolean = false;
  selectedModelName: string = "";
  onShowSetupClientModel(modelName: string) {
    this.isShowModal = true;
    this.selectedModelName = modelName;
    setTimeout(() => { $("#setup-model-popup").modal('show'); }, 100);
  }
  closeSetupModelPopup() {
    $("#setup-model-popup").modal('hide');
    setTimeout(() => { this.isShowModal = false; }, 100);
  }

  isUpdating: boolean = false;
  onUpdateClientModel() {
    this.isUpdating = true;
    this.onParentCommand.emit("UpdateModel");
  }

  onAddZone() {
    this.onParentCommand.emit("AddZone");
  }

  onChildAction(childActionName: string) {
    console.log("childActionName", childActionName);
    switch (childActionName) {
      case "onModelUpdated":
        this.isUpdating = false;
        this.closeSetupModelPopup();
        this.getClientModels();
        break;
      case "OnEquipmentCostUpdated":
        this.onCloseSetupEquipmentCostModal();
        break;
      default:
        break;
    }
  }

  // Start : Paid Parking Equipment Costs
  parkingTypes: any = this.lookupService.lookup.parkingTypes;
  selectedParkingType: any = null;
  onSetupEquipmentCost(parkingType) {
    console.log(parkingType);
    this.selectedParkingType = parkingType;
    this.onShowSetupEquipmentCostModal();
  }

  isShowSetupEquipmentCostModal: boolean = false;
  onShowSetupEquipmentCostModal() {
    this.isShowSetupEquipmentCostModal = true;
    // this.clientInfo
    setTimeout(() => { $("#setup-equipment-cost-modal").modal('show'); }, 100);
  }

  onCloseSetupEquipmentCostModal() {
    $("#setup-equipment-cost-modal").modal('hide');
    setTimeout(() => { this.isShowSetupEquipmentCostModal = false; }, 100);
  }

  onSaveSetupEquipmentCostModal() {
    this.onParentCommand.emit("SetupEquipmentCost");
  }
  // End : Paid Parking Equipment Costs

  locationTypes: any = [
    "On Street",
    "Off Street",
    "Garages"
  ];
  selectedLocation: string = "On Street";
  onLocationChange(locationName: string) {
    this.selectedLocation = locationName;
  }

  onClientUpdated($event) {
    this.getClientModels();
  }

  setupDoneMsg: string = "Setup for this model is completed.";
  setupPendingMsg: string = "This model is not yet setup.";
  isShowEditClient: boolean = false;
  onUpdateModelAvailability(model: any) {
    model.isAvailable = !model.isAvailable;
    let clientModelDto: ClientModelDto = new ClientModelDto();
    clientModelDto.clientModelId = model.clientModelId;
    clientModelDto.isAvailable = model.isAvailable;
    // this.isShowLoader = true;
    this.adminService.updateModelAvailability(clientModelDto)
      .subscribe((isUpdated: boolean) => {
        console.log(isUpdated);

        this.updateEquipmentCostTabButtonsAvailability();

        this.isShowEditClient = false;
        setTimeout(() => { this.isShowEditClient = true; }, 0);

        // this.isShowLoader = false;
        toastr.success("Update Model Availability Successfully.", "Success");
      }, (errorResponse: HttpErrorResponse) => {
        toastr.error("Failed to Update Model Availability", "Error");
        // this.isShowLoader = false;
      });
  }

}
