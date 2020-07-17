import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoaderComponent } from "../components/common/loader/loader.component";
import { CardLoaderComponent } from '../components/common/card-loader/card-loader.component';
import { SpinnerComponent } from '../components/common/spinner/spinner.component';


@NgModule({
    declarations: [
        LoaderComponent,
        CardLoaderComponent,
        SpinnerComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        LoaderComponent,
        CardLoaderComponent,
        SpinnerComponent
    ]
})
export class SharedModule {
    // static forRoot(config: any): ModuleWithProviders {
    //     return {
    //         ngModule: SharedModule,
    //         providers: [{ useValue: config }]
    //     };
    // }

    // static forChild(): ModuleWithProviders {
    //     return {
    //         ngModule: SharedModule
    //     };
    // }
}