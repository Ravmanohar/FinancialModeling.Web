import { SetupEscalatingModelDto } from "src/app/models/setup-escalating-model";
import { SetupHourlyModelDto } from 'src/app/models/setup-hourly-model';
import { SetupTimeOfDayModelDto } from 'src/app/models/setup-timeofday-model';
import { LocationEquipmentCost } from 'src/app/models/setup-equipment-cost.model';
import { EditClientModel } from 'src/app/models/add-client-model';
import { ZoneEquipmentSummary, ProjectedEquipmentCostSummary } from 'src/app/models/common.models';

export class DashboardTab {
    tabId: number;
    tabName: string;
    tabCode: string;
    isAvailable: boolean;
}
export class TabList {
    // financialDashboardTabs: Array<string> = [
    //     // "Instructions",
    //     "Financial Dashboard",
    //     "Hourly Revenue On-street",
    //     "Hourly Revenue Off-street",
    //     "Hourly Revenue Garage",
    //     "Time of Day On-street",
    //     "Time of Day Off-street",
    //     "Time of Day Garage",
    //     "Escalating Rate On-street",
    //     "Escalating Rate Off-street",
    //     "Escalating Rate Garage",
    //     "Equipment Cost On-Street",
    //     "Equipment Cost Off-Street",
    //     "Equipment Cost Garage",
    //     // "Space Inventory"
    // ];
    // escalatingOnStreet
    // escalatingOffStreet
    // escalatingGarages
    financialDashboardTabs: Array<Tab> = [
        {
            "id": 1,
            "name": "Financial Dashboard",
            "property": "financialDashboard",
            "showAlways": true
        },
        {
            "id": 2,
            "name": "Hourly On",
            "property": "hourlyOnStreet",
            "showAlways": false
        },
        {
            "id": 3,
            "name": "Hourly Off",
            "property": "hourlyOffStreet",
            "showAlways": false
        },
        {
            "id": 4,
            "name": "Hourly Garage",
            "property": "hourlyGarages",
            "showAlways": false
        },
        {
            "id": 5,
            "name": "Time of Day On",
            "property": "timeOfDayOnStreet",
            "showAlways": false
        },
        {
            "id": 6,
            "name": "Time of Day Off",
            "property": "timeOfDayOffStreet",
            "showAlways": false
        },
        {
            "id": 7,
            "name": "Time of Day Garage",
            "property": "timeOfDayGarages",
            "showAlways": false
        },
        {
            "id": 8,
            "name": "Escalating On",
            "property": "escalatingOnStreet",
            "showAlways": false
        },
        {
            "id": 9,
            "name": "Escalating Off",
            "property": "escalatingOffStreet",
            "showAlways": false
        },
        {
            "id": 10,
            "name": "Escalating Garage",
            "property": "escalatingGarages",
            "showAlways": false
        },
        {
            "id": 11,
            "name": "Equipment On",
            "property": "onStreetEquipmentCost",
            "showAlways": false
        },
        {
            "id": 12,
            "name": "Equipment Off",
            "property": "offStreetEquipmentCost",
            "showAlways": false
        },
        {
            "id": 13,
            "name": "Equipment Garage",
            "property": "garagesEquipmentCost",
            "showAlways": false
        }
    ]
}

export class Tab {
    id: number;
    name: string;
    property: string;
    showAlways: boolean = true;
}

export class FinancialDashboardDto {
    //NOTE : SetupModel Class name will change to HourlyModelDto
    // hourlyOnStreet: HourlyParkingZone;
    // hourlyOffStreet: HourlyParkingZone;
    // hourlyGarages: HourlyParkingZone;

    editClientModel: EditClientModel;

    hourlyOnStreet: SetupHourlyModelDto;
    hourlyOffStreet: SetupHourlyModelDto;
    hourlyGarages: SetupHourlyModelDto;

    //NOTE : SetupModel Class name will change to TimeOfDayModeDto
    timeOfDayOnStreet: SetupTimeOfDayModelDto;
    timeOfDayOffStreet: SetupTimeOfDayModelDto;
    timeOfDayGarages: SetupTimeOfDayModelDto;

    //NOTE : SetupModel Class name will change to EscalatingModeDto
    escalatingOnStreet: SetupEscalatingModelDto;
    escalatingOffStreet: SetupEscalatingModelDto;
    escalatingGarages: SetupEscalatingModelDto;


    onStreetEquipmentCost: LocationEquipmentCost;
    offStreetEquipmentCost: LocationEquipmentCost;
    garagesEquipmentCost: LocationEquipmentCost;

    // OnStreetEquipmentCost: OnStreetEquipmentCost;
    // OnStreetEquipmentCost: OffStreetEquipmentCost;
    // OnStreetEquipmentCost: GaragesEquipmentCost;

    // public LocationEquipmentCostModel OnStreetEquipmentCost { get; set; }
    // public LocationEquipmentCostModel OffStreetEquipmentCost { get; set; }
    // public LocationEquipmentCostModel GaragesEquipmentCost { get; set; }
}

export class EquipmentCostTab {
    tabId: number;
    tabName: string;
}

export class EquipmentCostTabList {
    equipmentTabs: Array<string> = [
        "Equipment Cost On-street",
        "Equipment Cost Off-street",
        "Equipment Cost Garages"
    ];
}

export class FinancialDashboardRevenueModel {
    hourlyRevenueModel: RevenueModel = new RevenueModel();
    timeOfDayRevenueModel: RevenueModel = new RevenueModel();
    escalatingRevenueModel: RevenueModel = new RevenueModel();
}
export class RevenueModel {
    // onStreet: Array<ZoneRevenueSummary> = new Array<ZoneRevenueSummary>();
    // offStreet: Array<ZoneRevenueSummary> = new Array<ZoneRevenueSummary>();
    // garages: Array<ZoneRevenueSummary> = new Array<ZoneRevenueSummary>();
    onStreet: Years = new Years();
    offStreet: Years = new Years();
    garages: Years = new Years();
    /*
       // Note : Data type is any because in future we can provide year selection instead of calculating it for only 5 years

        // Above properties will container object like below
        onStreet = {
            1: Array<ZoneRevenueSummary>,
            2: Array<ZoneRevenueSummary>,
            3: Array<ZoneRevenueSummary>,
            4: Array<ZoneRevenueSummary>,
            5: Array<ZoneRevenueSummary>,
        }
    */
}

export class Years {
    year1: Array<ZoneRevenueSummary> = new Array<ZoneRevenueSummary>();
    year2: Array<ZoneRevenueSummary> = new Array<ZoneRevenueSummary>();
    year3: Array<ZoneRevenueSummary> = new Array<ZoneRevenueSummary>();
    year4: Array<ZoneRevenueSummary> = new Array<ZoneRevenueSummary>();
    year5: Array<ZoneRevenueSummary> = new Array<ZoneRevenueSummary>();
}

export class ZoneRevenueSummary {
    zoneId: number = 0;
    zoneName: string = "Zone";
    nonPeak: ZoneRevenue = new ZoneRevenue();
    peak: ZoneRevenue = new ZoneRevenue();
}

export class ZoneRevenue {
    revenue: number = 0;
    cost: number = 0;
    gain: number = 0;
    constructor(revenue = 0, cost = 0) {
        this.revenue = Math.round(revenue);
        this.cost = Math.round(cost);
        this.gain = this.revenue - this.cost;
    }
}

export class ProfitInfo {
    equipmentBudget: number = 0;
    annualOperatingCost: number = 0;
    annualRevenue: number = 0;
}

export class DashboardEquipmentCostSummary {
    onStreetZoneEquipmentSummary: ZoneEquipmentSummary;
    offStreetZoneEquipmentSummary: ZoneEquipmentSummary;
    garagesZoneEquipmentSummary: ZoneEquipmentSummary;

    annualOperatingCost: number = 0;
    equipmentBudget: number = 0;
}