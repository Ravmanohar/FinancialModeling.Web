import { ActionType } from './enums';

export class AddClientModel {
    clientId: number = 0;
    clientName: string = "";

    isPeakSeasonPricing: boolean = false;
    havePermits: boolean = false;

    onStreetZones: Array<AddZoneModel> = [];
    offStreetZones: Array<AddZoneModel> = [];
    garagesZones: Array<AddZoneModel> = [];

    onStreetPermits: Array<AddPermitModel> = [];
    offStreetPermits: Array<AddPermitModel> = [];
    garagesPermits: Array<AddPermitModel> = [];

    isOnStreetAvailable: boolean = false;
    isOffStreetAvailable: boolean = false;
    isGarageAvailable: boolean = false;
}

export class EditClientModel {
    clientId: number = 0;
    clientName: string = "";

    isPeakSeasonPricing: boolean = false;
    havePermits: boolean = false;

    onStreetZones: Array<AddZoneModel> = [];
    offStreetZones: Array<AddZoneModel> = [];
    garagesZones: Array<AddZoneModel> = [];

    onStreetPermits: Array<AddPermitModel> = [];
    offStreetPermits: Array<AddPermitModel> = [];
    garagesPermits: Array<AddPermitModel> = [];

    isOnStreetAvailable: boolean = false;
    isOffStreetAvailable: boolean = false;
    isGarageAvailable: boolean = false;
}

export class AddPermitModel {
    permitName: string = "";
    permitCode: number = 0;
    actionType: ActionType = ActionType.Created;
    isAvailable: boolean = true;
}

export class AddZoneModel {
    zoneName: string = "";
    zoneCode: number = 0;
    operatingDays: number = 0;
    actionType: ActionType = ActionType.Created;
}

export class ParkingClientModel {
    clientId: number = 0;
    clientName: string = "";
    createdById: string = null;

    numberOfUsers: number = 0;

    onStreetZoneCount: number = 0;
    offStreetZoneCount: number = 0
    garagesZoneCount: number = 0;

    onStreetPermitCount: number = 0;
    offStreetPermitCount: number = 0;
    garagesPermitCount: number = 0;

    isActive: boolean = false;
}

export class ClientModelDto {
    clientModelId: number = 0;
    clientId: number = 0;
    parkingTypeId: number = 0;
    modelTypeId: number = 0;
    isSetupDone: boolean;
    isAvailable: boolean;
    createdById: string = "";
    createdDate: string = "";
    updatedById: string = "";
    updatedDate: string = "";
    isActive: boolean;
}

// export class ClientModelInfo {
//     clientModelId: number;
//     clientId: number;
//     parkingTypeId: number;
//     modelTypeId: number;
//     createDate: Date;
//     modifiedDate: Date;
//     createdBy: string;
//     createdByName: string;
//     modifiedBy: string;
//     modifiedByName: string;

//     modelCombinationName: string;
//     parkingTypeName: string;
//     modelTypeName: string;
// }