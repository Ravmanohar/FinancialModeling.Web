import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/modules/shared.module";

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { FormControl } from "@angular/forms";

import { StarterViewComponent } from "./starterview.component";
import { LoginComponent } from "./login.component";
import { RegisterComponent } from "./register.component";
import { ResetPasswordComponent } from './reset-password.component';


@NgModule({
  declarations: [
    StarterViewComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    // FormGroup,
    // FormControl
  ],
  exports: [
    StarterViewComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
  ],
})

export class AppviewsModule {
}
