import { ParkingType, ModelType, OperatingDays, ClientPermitType } from './common.models';

export class SetupHourlyModelDto {
    clientModelId: number = 0;

    clientId: number = 0;
    clientName: string = "";

    parkingTypeId: number = 0;
    selectedParkingType: ParkingType = new ParkingType();

    modelTypeId: number = 0;
    selectedModelType: ModelType = new ModelType();

    hourlyZones: Array<HourlyZone> = [];
    isSetupDone: boolean = false;
    isAvailable: boolean = false;
}

export class HourlyZone {
    //Start : Zone specific properties
    zoneId: number = 0;
    zoneCode: number = 0;
    zoneName: string = "Zone";
    clientModelId: number = 0;
    clientId: number = 0;

    nonPeakSeasonHourlyRate: number = 0;
    peakSeasonHourlyRate: number = 0;

    numberOfSpacesPerZone: number = 0;
    percentOfSpaceOccupied: number = 0;
    numberOfSpacesRemaining: number = 0;//UI properties

    compliancePercentage: number = 0;

    nonPeakOccupancyPercentage: number = 0;
    peakOccupancyPercentage: number = 0;

    hourlyOperatingHour: HourlyOperatingHour = new HourlyOperatingHour();
    operatingDays: OperatingDays = new OperatingDays();

    clientPermitTypes: Array<ClientPermitType> = [];

    isModified: boolean = false;
}

export class HourlyOperatingHour {
    id: number = 0;
    clientId: number = 0;
    zoneId: number = 0;

    startTime: string = "08:00 AM";
    endTime: string = "12:00 AM";
    totalHours: number = 0;//UI properties
}