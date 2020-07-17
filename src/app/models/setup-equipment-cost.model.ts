import { LuEquipmentType } from './common.models';
import { ActionType } from './enums';

//Start : On Street Equipment Cost Model
export class LocationEquipmentCost {
    zones: Array<EquipmentZone> = new Array<EquipmentZone>();
}

export class EquipmentZone {
    clientId: number = 0;
    zoneCode: number = 0;
    zoneName: string = "zoneName";
    operatingDays: number = 0;
    locationType: string = "OnStreet";
    parkingTypeId: number = 0;
    equipments: Array<EquipmentCost> = new Array<EquipmentCost>();
    equipment: EquipmentCost = new EquipmentCost();//This will contain total sum of all then equipments
}

export class EquipmentCost {
    equipmentId: number = 0;

    unitsOwned: number = 0;
    unitsPurchased: number = 0;
    //Start : OnStreet And OffStreet Fields
    costOfBaseUnit: number = 0;
    monthlyMeterSoftwareFees: number = 0;
    warrantyStartingYear: number = 1;
    //End : OnStreet And OffStreet Fields

    //Start : Garages Fields
    quantityOfUnits: number = 0;
    multiSpaceMeterCost: number = 0;
    equipWithBNA: number = 0;
    equipWithCreditCard: number = 0;
    annualSoftwareFee: number = 0;
    isWarrantyIncluded: boolean = false;
    //End : Garages Fields

    monthlyCreditCardProcessingFees: number = 0;
    estimatedCreditCardTransaction: number = 0;

    equipmentTypeId: number = 0;
    clientId: number = 0;
    parkingTypeId: number = 0;

    selectedEquipmentType: LuEquipmentType = new LuEquipmentType();

    actionType: ActionType = ActionType.Created;
}
//End : On Street Equipment Cost Model


export class ColumnMapping {
    labels: CostLables = new CostLables();
    infos: DixonInfos = new DixonInfos();
    onStreetColumnNames: Array<string> = [
        "selectedEquipmentType",

        "unitsOwned",
        "unitsPurchased",

        "costOfBaseUnit",
        "warrantyStartingYear",
        "monthlyMeterSoftwareFees",

        "monthlyCreditCardProcessingFees",
        "estimatedCreditCardTransaction",
    ];
    columnNames: Array<string> = [
        "selectedEquipmentType",

        "unitsOwned",
        "unitsPurchased",

        "quantityOfUnits",
        "costOfBaseUnit", //"multiSpaceMeterCost",
        "equipWithBNA",
        "equipWithCreditCard",
        "warrantyStartingYear", // "isWarrantyIncluded",
        "annualSoftwareFee",

        "monthlyCreditCardProcessingFees",
        "estimatedCreditCardTransaction",
    ];
}

export class DixonInfos {
    OnStreet: any = {
        monthlyCreditCardProcessingFees: "Not all vendors charge a credit card processing fee per transaction.",
        equipmentCost: "Estimated equipment costs do not include the cost of installation, freight, etc. All workbook pricing has been conservatively estimated by DIXON based upon a variety of recent meter vendor proposals. A quote should be obtained from a qualified Vendor for the most accurate and up to date costs.",
        estimatedCostOfAdditionalSparesAndMisc: "In order to account for some of the unforseen misc. costs and paper rolls, we have estimated 10% of the initial equipment expense as part of the annual on-going support costs.",
    };
    OffStreet: any = {
        unitsOwned: "Applicable to Single, Dual, and Multi-space meters only. Fill in quantity owned only if existing units are smart meters with software and credit card processing fees.",
        unitsPurchased: "Applicable to Single, Dual, and Multi-space meters only.",
        quantityOfUnits: "Applicable to PARCS equipment only.",
        // monthlyCreditCardProcessingFees: "Not all vendors charge a credit card processing fee per transaction. ",
        equipmentCost: "Estimated equipment costs do not include the cost of installation, freight, etc. All workbook pricing has been conservatively estimated by DIXON based upon a variety of recent meter vendor proposals. A quote should be obtained from a qualified Vendor for the most accurate and up to date costs.",

        estimatedCostOfAdditionalSparesAndMisc: "In order to account for some of the unforseen misc. costs and paper rolls, we have estimated 10% of the initial equipment expense as part of the annual on-going support costs. You will see this value represented in row 17 above. ",
        equipWithBNA: "Applicable to PARCS equipment only. Enter total cost for all proposed Pay on Foot (BNA) units",
        equipWithCreditCard: "Applicable to PARCS equipment only. Enter total cost for all proposed Pay on Foot (credit card) units",
        monthlyCreditCardProcessingFees: "Applicable to Single, Dual, and Multi-space meters only.",
        estimatedCreditCardTransaction: "Applicable to Single, Dual, and Multi-space meters only.",
    };
    Garages: any = {
        unitsOwned: "Applicable to Single, Dual, and Multi-space meters only. Fill in quantity owned only if existing units are smart meters with software and credit card processing fees.",
        unitsPurchased: "Applicable to Single, Dual, and Multi-space meters only.",
        quantityOfUnits: "Applicable to PARCS equipment only.",

        estimatedCostOfAdditionalSparesAndMisc: "In order to account for some of the unforseen misc. costs we have estimated 10% of the initial equipment expense as part of the annual on-going support costs. You will see this value represented in row 17 above.",
        equipWithBNA: "Applicable to PARCS equipment only. Enter total cost for all proposed Pay on Foot (BNA) units",
        equipWithCreditCard: "Applicable to PARCS equipment only. Enter total cost for all proposed Pay on Foot (credit card) units",
        monthlyCreditCardProcessingFees: "Applicable to Single, Dual, and Multi-space meters only.",
        estimatedCreditCardTransaction: "Applicable to Single, Dual, and Multi-space meters only.",
    };
}

export class CostLables {
    selectedEquipmentType: string = "Equipment Type";
    unitsOwned: string = "Units Owned";
    unitsPurchased: string = "Units Purchased";
    costOfBaseUnit: string = "Cost of Base Unit";
    warrantyStartingYear: string = "Annual Warranty";
    monthlyMeterSoftwareFees: string = "Monthly Meter Software Fees";
    monthlyCreditCardProcessingFees: string = "Monthly CC Processing Fees - Per Transaction";
    estimatedCreditCardTransaction: string = "Estimated # of Credit Card Trans Per Unit / Per Day";

    quantityOfUnits: string = "Garage Access Points (Ingress/Egress)";
    multiSpaceMeterCost: string = "Cost of Base Unit";
    equipWithBNA: string = "Pay on Foot Equip with BNA";
    equipWithCreditCard: string = "Pay on Foot Equip with Credit Card";
    annualSoftwareFee: string = "Monthly Software Fees - Per Unit / Garage";
    isWarrantyIncluded: string = "Meter Warranty (applies starting in Year 2)";
}

export class EquipmentCostLoader {
    loaderProperty: string;
    onStreetLoader: boolean;
    offStreetLoader: boolean;
    garagesLoader: boolean;
}