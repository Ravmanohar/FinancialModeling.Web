import { FinancialDashboardDto } from './setup.model.index';

export class ProjectionModel {
    projectionId: number = 0;
    projectionName: string = "";
    clientId: number = 0;
    userId: string = "";
    createdDate: string;
    createdDateUtc: string;
    createdById: string = "";
    modifiedById: string = "";
    modifiedDate: Date;
    financialDashboard: FinancialDashboardDto = new FinancialDashboardDto();
}
