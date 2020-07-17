import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules, NoPreloading } from '@angular/router';
import { DashboardComponent, UsersComponent, ViewClientsComponent, HomeComponent, } from './components';
import { GuardService } from './services';

import { BasicLayoutComponent } from 'src/app/components/common/layouts/basicLayout.component';
import { StarterViewComponent } from 'src/app/views/appviews/starterview.component';
import { BlankLayoutComponent } from 'src/app/components/common/layouts/blankLayout.component';

import { LoginComponent } from 'src/app/views/appviews/login.component';
import { RegisterComponent } from 'src/app/views/appviews/register.component';
import { ProjectionsComponent } from 'src/app/components/client-models/projections/projections.component';
import { HourlyModelComponent } from 'src/app/components/client-models/hourly-model/hourly-model.component';
import { FinancialDashboardComponent } from 'src/app/components/financial-dashboard/financial-dashboard.component';
import { ManageClientComponent } from 'src/app/components/manage-client/manage-client.component';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: '', component: BasicLayoutComponent,
        children: [
            { path: 'starterview', component: StarterViewComponent, canActivate: [GuardService], data: { roles: ["All"] } },
            { path: 'dashboard-report', component: DashboardComponent, canActivate: [GuardService], data: { roles: ["All"] } },
            { path: 'users', component: UsersComponent, canActivate: [GuardService], data: { roles: ["All"] } },
            { path: 'financial-dashboard', component: FinancialDashboardComponent, canActivate: [GuardService], data: { roles: ["All"] } },
            { path: 'financial-dashboard/:projectionId', component: FinancialDashboardComponent, canActivate: [GuardService], data: { roles: ["All"] } },

            { path: 'view-clients', component: ViewClientsComponent, canActivate: [GuardService], data: { roles: ["Admin"] } },
            { path: 'manage-client', component: ManageClientComponent, canActivate: [GuardService], data: { roles: ["Admin"] } },

            { path: 'projections', component: ProjectionsComponent, canActivate: [GuardService], data: { roles: ["User"] } },
        ]
    },
    {
        path: '', component: BlankLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent, data: { roles: ["All"] } },
            { path: 'home', component: HomeComponent, data: { roles: ["All"] } },
        ]
    },
    // Handle all other routes
    { path: '**', redirectTo: 'login' }
    //Lazy Loading code snipet
    // {
    //   path: 'pathname',
    //   loadChildren: 'filePatth#ModuleName',
    //   data: { preload: false },
    // },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: NoPreloading })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
