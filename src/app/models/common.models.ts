export class ClientPermitType {
    permitId: number = 0;
    permitCode: number = 0;

    permitName: string = "";
    annualCost: number = 0;
    quantitySold: number = 0;

    clientId: number = 0;
    clientModelId: number = 0;
    zoneId: number = 0;
}

//Below are UI classes just ignore
export class ParkingType {
    parkingTypeId: number = 0;
    parkingTypeName: string = "";
}

export class ModelType {
    modelTypeId: number = 0;
    modelTypeName: string = "";
}

export class OperatingDays {
    id: number = 0;
    daysPerYear: number = 365;//UI properties
    peakDays: number = 0;
    offDays: number = 0;
    nonPeakDays: number = 0;//UI properties

    clientId: number = 0;
    clientModelId: number = 0;
    zoneId: number = 0;
}

export class ProjectedRevenueSummary {
    reportName: string = "";
    reportHeader: string = "";
    isAvailable: boolean = false;
    parkingTypeId: number = 0;
    zoneSummaryList: Array<ZoneSummary> = new Array<ZoneSummary>();
}
export class ZoneSummary {
    zoneCode: number;
    zoneName: string;
    nonPeak: RevenueInfo;// = new Info();
    peak: RevenueInfo;// = new Info();
    variance: RevenueInfo;// = new Info();
}

export class RevenueInfo {
    hourly: number;
    permit: number;
    total: number;
    constructor(hourly, permit) {
        this.hourly = Math.round(hourly);
        this.permit = Math.round(permit);
        this.total = this.hourly + this.permit;
    }
}

export class LuEquipmentType {
    id: number = 0;
    name: string = "";
    typeId: number = 0;
}


export class ProjectedEquipmentCostSummary {
    reportName: string = "";
    reportHeader: string = "";
    isAvailable: boolean = false;
    zoneEquipmentList: Array<ZoneEquipmentSummary> = new Array<ZoneEquipmentSummary>();
}
export class ZoneEquipmentSummary {
    zoneId: number = 0;
    zoneName: string = "";
    zoneCode: number = 0;

    equipmentCost: number = 0;
    estimatedSoftwareFees: number = 0;
    estimatedCreditCardTransactionFees: number = 0;
    estimatedCostOfAdditionalSparesAndMisc: number = 0;
    subtotalOperatingCost: number = 0;
    total: number = 0;

    warrantyCostYear2: any = 0;
    warrantyCostYear3: any = 0;
    warrantyCostYear4: any = 0;
    warrantyCostYear5: any = 0;

    totalEstimatedEquipmentAndOperatingCost1: number = 0;
    totalEstimatedEquipmentAndOperatingCost2: number = 0;
    totalEstimatedEquipmentAndOperatingCost3: number = 0;
    totalEstimatedEquipmentAndOperatingCost4: number = 0;
    totalEstimatedEquipmentAndOperatingCost5: number = 0;
}