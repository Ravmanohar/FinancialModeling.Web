import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { AuthenticationService } from '../../services';
import { LoginModel } from 'src/app/models';
import { AccountService } from 'src/app/services/account.service';

declare var $;
declare var toastr;
@Component({
  selector: 'login',
  templateUrl: 'login.template.html',
  styleUrls: ['login.template.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private authenticationService: AuthenticationService
  ) {
  }

  public loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loginModel: LoginModel;
  ngOnInit() {
    this.loginModel = new LoginModel();
  }

  // goToRegisterAccount() {
  //   this.authenticationService.goToRegisterAccount();
  // }

  onSubmit() {
    console.log(this.loginForm);
    if (this.loginForm.status == 'VALID') {
      this.loginModel.grant_type = "password";
      this.loginModel.email = this.loginForm.controls.email.value;
      this.loginModel.password = this.loginForm.controls.password.value;
      this.accountService.loginAccount(this.loginModel);
    } else {
      toastr.error("Invalid Login Attempt", "Error");
    }
  }

}
