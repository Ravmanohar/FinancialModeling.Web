import { ClientPermitType, OperatingDays, ModelType, ParkingType } from './common.models';

export class SetupEscalatingModelDto {
    clientModelId: number = 0;

    clientId: number = 0;
    clientName: string = "";

    parkingTypeId: number = 0;
    selectedParkingType: ParkingType = new ParkingType();

    modelTypeId: number = 0;
    selectedModelType: ModelType = new ModelType();

    escalatingZones: Array<EscalatingZone> = [];
    isSetupDone: boolean = false;
    isAvailable: boolean = false;
}

export class HourlyPercentValue {
    hour: number = 0;
    percent: number = 0;
}

export class EscalatingZone {
    //Start : Zone specific properties
    zoneId: number = 0;
    zoneCode: number = 0;
    zoneName: string = "Zone 1";
    clientModelId: number = 0;
    clientId: number = 0;

    nonPeakHourlyRate: number = 0;
    nonPeakEscalatingRate: number = 0;
    nonPeakHourEscalatingRateBegins: number = 0;
    nonPeakDailyMaxOrAllDayRate: number = 0;
    nonPeakEveningFlatRate: number = 0;

    peakHourlyRate: number = 0;
    peakEscalatingRate: number = 0;
    peakHourEscalatingRateBegins: number = 0;
    peakDailyMaxOrAllDayRate: number = 0;
    peakEveningFlatRate: number = 0;


    numberOfSpacesPerZone: number = 0;
    percentOfSpaceOccupied: number = 0;
    numberOfSpacesRemaining: number = 0;//UI property

    compliancePercentage: number = 0;

    nonPeakOccupancyPercentage: number = 0;
    peakOccupancyPercentage: number = 0;

    operatingDays: OperatingDays = new OperatingDays();

    escalatingOperatingHourDaily: EscalatingOperatingHour = new EscalatingOperatingHour();
    escalatingOperatingHourEvening: EscalatingOperatingHour = new EscalatingOperatingHour();

    clientPermitTypes: Array<ClientPermitType> = [];

    isModified: boolean = false;

    dailyHourlyPercentValuesJson: string;
    dailyHourlyPercentValuesList: Array<HourlyPercentValue> = new Array<HourlyPercentValue>();
}

export class EscalatingOperatingHour {
    id: number = 0;
    clientId: number = 0;
    zoneId: number = 0;
    clientModelId: number = 0;

    startTime: string = "08:00 AM";
    endTime: string = "12:00 AM";
    totalHours: number = 0;//UI properties
    operatingHourType: number = 1;//"Daily";//Evening
}