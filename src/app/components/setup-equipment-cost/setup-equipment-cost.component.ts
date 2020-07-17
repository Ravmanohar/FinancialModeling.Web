import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { LocationEquipmentCost, EquipmentCost, EquipmentZone, ColumnMapping } from 'src/app/models/setup-equipment-cost.model';
import { LuEquipmentType, ProjectedEquipmentCostSummary } from 'src/app/models/common.models';
import { ParkingTypeEnum, ActionType } from 'src/app/models/enums';
import { FinancialDashboardDto } from 'src/app/models/setup.model.index';
import { FinancialDashboardService } from '../financial-dashboard/financial-dashboard.service';
import { BusinessService } from 'src/app/services/business.service';
import { SetupModelService } from 'src/app/services/setup-model.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomCurrencyPipe } from 'src/app/pipes/custom-currency-pipe';
import { AddZoneModel } from 'src/app/models/add-client-model';
import { AdminService } from 'src/app/services';

declare var toastr;
declare var $;
@Component({
  selector: 'app-setup-equipment-cost',
  templateUrl: './setup-equipment-cost.component.html',
  styleUrls: ['./setup-equipment-cost.component.scss'],
  providers: [CustomCurrencyPipe]
})
export class SetupEquipmentCostComponent implements OnInit {
  @Input() private ClientInfo: any = null;
  @Input() public calculateYearlyRevenue: boolean = null;
  @Input() private parkingTypeId: any = null;
  @Input() private financialDashboard: FinancialDashboardDto;
  @Input() private onParentCommand: EventEmitter<string>;

  @Output() onChildAction: EventEmitter<string> = new EventEmitter();

  // parkingTypeId: number = 0;
  constructor(
    public financialDashboardService: FinancialDashboardService,
    private changeDetector: ChangeDetectorRef,
    private businessService: BusinessService,
    private setupModelService: SetupModelService,
    private adminService: AdminService,
  ) {

  }

  luEquipmentTypes: Array<LuEquipmentType> = new Array<LuEquipmentType>();
  ngOnInit() {
    // this.parkingTypeId = this.ParkingType.parkingTypeId;

    this.luEquipmentTypes = [
      { id: 1, name: "Single Space Meters", typeId: 1 },
      { id: 2, name: "Dual Space Meters", typeId: 2 },
      { id: 3, name: "Pay Stations", typeId: 3 },
      { id: 4, name: "Mobile Payment", typeId: 4 },
      { id: 5, name: "PARCS Equipment", typeId: 5 },
    ];

    if (this.onParentCommand) {
      this.onParentCommandSubscription = this.onParentCommand.subscribe(commandName => {
        console.log(commandName);
        switch (commandName) {
          case "SetupEquipmentCost":
            this.onSaveEquipmentCost();
            break;
          default:
            break;
        }
      });
    }
    console.log(this.ClientInfo);
    console.log(this.parkingTypeId);
    this.loadEquipmentCostByLocationType();
  }

  projectedEquipmentCostSummary: ProjectedEquipmentCostSummary = null;
  isShowLoader: boolean = false;
  locationEquipmentCost: LocationEquipmentCost = new LocationEquipmentCost();
  locationName: string = "OnStreet";
  columnMapping: ColumnMapping = new ColumnMapping();
  equipmentCostColumns: Array<string> = [];
  yesNoOptions: Array<string> = ["Yes", "No"];
  loadEquipmentCostByLocationType() {
    switch (this.parkingTypeId) {
      case ParkingTypeEnum.OnStreet:
        this.locationEquipmentCost = this.financialDashboard.onStreetEquipmentCost;
        this.locationName = "OnStreet";
        this.equipmentCostColumns = this.columnMapping.onStreetColumnNames;
        break;
      case ParkingTypeEnum.OffStreet:
        this.locationEquipmentCost = this.financialDashboard.offStreetEquipmentCost;
        this.locationName = "OffStreet";
        this.equipmentCostColumns = this.columnMapping.columnNames;
        break;
      case ParkingTypeEnum.Garages:
        this.locationEquipmentCost = this.financialDashboard.garagesEquipmentCost;
        this.locationName = "Garages";
        this.equipmentCostColumns = this.columnMapping.columnNames;
        break;
      default:
        break;
    }
    this.locationEquipmentCost.zones.forEach((zone: EquipmentZone) => {
      zone.equipments.forEach((equipment: EquipmentCost) => {
        equipment.selectedEquipmentType = this.luEquipmentTypes.find(x => x.id == equipment.equipmentTypeId);
      });
    });
    // console.log(this.locationEquipmentCost);

    if (this.calculateYearlyRevenue) {
      this.projectedEquipmentCostSummary = this.businessService.getProjectedEquipmentCostSummary(this.locationEquipmentCost, this.locationName);
      // console.log(this.projectedEquipmentCostSummary);
    }

    this.setDefaultFirstPage();
  }

  private onParentCommandSubscription: any;
  ngOnDestroy() {
    if (this.onParentCommand) {
      this.onParentCommandSubscription.unsubscribe();
    }
  }

  selectedEquipmentZone: EquipmentZone = new EquipmentZone();
  lastPageNumber: number = 0;
  selectedPage: number = 1;
  setDefaultFirstPage() {
    this.lastPageNumber = this.locationEquipmentCost.zones.length;
    this.selectedEquipmentZone = this.locationEquipmentCost.zones[this.selectedPage - 1];
  }

  onNext() {
    var nextPage = this.selectedPage + 1;
    nextPage = nextPage > this.lastPageNumber ? this.lastPageNumber : nextPage;
    this.selectedPage = nextPage;

    this.selectedEquipmentZone = this.locationEquipmentCost.zones[this.selectedPage - 1];
  }

  onPrevious() {
    var previousPage = this.selectedPage - 1;
    previousPage = previousPage < 0 ? 1 : previousPage;
    this.selectedPage = previousPage;

    this.selectedEquipmentZone = this.locationEquipmentCost.zones[this.selectedPage - 1];
  }

  showHideLoader(isShowLoader) {
    let loaderProperty: string = this.setupModelService.equipmentCostLoader.loaderProperty;
    this.setupModelService.equipmentCostLoader[loaderProperty] = isShowLoader;
  }

  onSaveEquipmentCost() {
    console.log("onSaveEquipmentCost", this.locationEquipmentCost);
    let loaderProperty: string = null;
    switch (this.parkingTypeId) {
      case ParkingTypeEnum.OnStreet:
        loaderProperty = "onStreetLoader";
        break;
      case ParkingTypeEnum.OffStreet:
        loaderProperty = "offStreetLoader";
        break;
      case ParkingTypeEnum.Garages:
        loaderProperty = "garagesLoader";
        break;
    }
    this.showHideLoader(true);

    this.isShowLoader = true;
    this.setupModelService.updateEquipmentCost(this.locationEquipmentCost)
      .subscribe((locationEquipmentCost: LocationEquipmentCost) => {
        this.locationEquipmentCost = locationEquipmentCost;
        switch (this.parkingTypeId) {
          case ParkingTypeEnum.OnStreet:
            this.financialDashboard.onStreetEquipmentCost = locationEquipmentCost;
            break;
          case ParkingTypeEnum.OffStreet:
            this.financialDashboard.offStreetEquipmentCost = locationEquipmentCost;
            break;
          case ParkingTypeEnum.Garages:
            this.financialDashboard.garagesEquipmentCost = locationEquipmentCost;
            break;
          default:
            break;
        }

        this.isShowLoader = false;
        toastr.success("Successfully Updated Equipment Cost.", "Success");

        this.onChildAction.emit("OnEquipmentCostUpdated");
        this.showHideLoader(false);
      }, (errorResponse: HttpErrorResponse) => {
        toastr.error("Failed To Update Equipment Cost.", "Error");
        this.isShowLoader = false;
        this.showHideLoader(false);
      });
  }

  onEquipmentTypeChange(equipment: EquipmentCost, equipmentType: LuEquipmentType) {
    equipment.selectedEquipmentType = equipmentType;
    equipment.equipmentTypeId = equipmentType.id;
  }

  onAddEquipment() {
    let equipmentCost: EquipmentCost = new EquipmentCost();
    //TODO
    console.log("Needs validations");
    this.selectedEquipmentZone.equipments.push(equipmentCost);
  }

  deletedActionType: number = ActionType.Deleted;
  onRemoveEquipment(removeIndex: number, equipment: EquipmentCost) {
    if (equipment.equipmentId == 0)
      this.selectedEquipmentZone.equipments.splice(removeIndex, 1);
    else
      equipment.actionType = ActionType.Deleted;
  }

  onApply() {
    console.log(this.locationEquipmentCost);
    this.projectedEquipmentCostSummary = this.businessService.getProjectedEquipmentCostSummary(this.locationEquipmentCost, this.locationName);
    this.changeDetector.detectChanges();
  }

  onToggleWizardContent($event) {
    $("#setup-equipment-cost-wizard-content").slideToggle(1000);
  }

  onUpdateOperatingDays(selectedEquipmentZone: EquipmentZone) {
    console.log("Call API to update this value", selectedEquipmentZone);
    const zone: AddZoneModel = new AddZoneModel();
    zone.zoneCode = selectedEquipmentZone.zoneCode;
    zone.operatingDays = selectedEquipmentZone.operatingDays;
    this.adminService.updateZoneOperatingDays(zone)
      .subscribe((addZoneModel: AddZoneModel) => {
        console.log(addZoneModel);
        toastr.success("Successfully Updated Operating days.", "Success");
      }, (errorResponse: HttpErrorResponse) => { });
  }

}
