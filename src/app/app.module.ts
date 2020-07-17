import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from "src/app/modules/shared.module";

import { AppComponent } from './app.component';
import {
  DashboardComponent,
  // SetupClientComponent, ClientListComponent,
  HomeComponent, ViewClientsComponent,
  // ReportComponent, 
  ManageClientComponent,

} from './components';

import { AppviewsModule, LayoutsModule } from './modules';
import { UsersComponent } from './components/users/users.component';
import { TokenInterceptor } from 'src/app/custom-headers.service';
import { AddClientModalComponent } from './components/add-client-modal/add-client-modal.component';
import { SetupModelTabComponent } from './components/setup-model-tab/setup-model-tab.component';
import { HourlyModelComponent } from './components/client-models/hourly-model/hourly-model.component';
import { TimeofdayModelComponent } from './components/client-models/timeofday-model/timeofday-model.component';
import { EscalatingModelComponent } from './components/client-models/escalating-model/escalating-model.component';
import { ProjectionsComponent } from './components/client-models/projections/projections.component';
import { FinancialDashboardComponent } from './components/financial-dashboard/financial-dashboard.component';
import { InstructionsComponent } from './components/financial-dashboard/instructions/instructions.component';
import { MainDashboardComponent } from './components/financial-dashboard/main-dashboard/main-dashboard.component';
import { SetupEquipmentCostComponent } from './components/setup-equipment-cost/setup-equipment-cost.component';
import { OrderByPipe } from './pipes/order-by.pipe';
import { SortPipe } from './pipes/sort.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { CustomCurrencyPipe } from './pipes/custom-currency-pipe';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    UsersComponent,
    ManageClientComponent,
    ViewClientsComponent,
    AddClientModalComponent,
    SetupModelTabComponent,
    HourlyModelComponent,
    TimeofdayModelComponent,
    EscalatingModelComponent,
    ProjectionsComponent,
    FinancialDashboardComponent,
    InstructionsComponent,
    MainDashboardComponent,
    SetupEquipmentCostComponent,

    OrderByPipe,
    SortPipe,
    FilterPipe,
    CustomCurrencyPipe,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,

    // DashboardsModule,
    LayoutsModule,
    AppviewsModule,
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
