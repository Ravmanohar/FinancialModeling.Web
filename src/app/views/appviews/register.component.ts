import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { AuthenticationService, SharedModelService } from '../../services';
import { RegisterModel, UserRole } from 'src/app/models';
import { LookupService } from 'src/app/services/lookup.service';
import { UserDto } from 'src/app/models/user-model';
import { AccountService } from 'src/app/services/account.service';

declare var toastr;
declare var $;
@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styles: [
    `.role-dropdown-button{ 
      display: flex;
      justify-content: center;
      justify-content: space-between;
      align-items: center;}
     .btn-white{background: #fff;font-weight: 600;}
    `]
})
export class RegisterComponent implements OnInit {
  @Input() clientId: number = null;
  @Output() onUserAdded: EventEmitter<string> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private accountService: AccountService,
    public sharedModel: SharedModelService,
    private authenticationService: AuthenticationService
  ) {
  }

  public registerForm: FormGroup = this.formBuilder.group({
    // name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  registerModel: RegisterModel = new RegisterModel();
  roleList: Array<UserRole> = [];
  ngOnInit() {
    this.roleList = this.lookupService.getRoles();
    this.registerModel.userRole = this.roleList.find(x => x.roleId == 2);
    console.log(this.roleList);
  }

  onSubmit() {
    console.log(this.registerForm);
    if (this.registerForm.status == 'VALID') {
      // this.registerModel.name = this.registerForm.controls.name.value;
      this.registerModel.email = this.registerForm.controls.email.value;
      this.registerModel.password = this.registerForm.controls.password.value;
      this.registerModel.confirmPassword = this.registerForm.controls.confirmPassword.value;
      this.registerModel.clientId = this.clientId;
      this.sharedModel.isShowRegisterUserLoader = true;

      var $registrationCard = $('#registration-card');
      $registrationCard.toggleClass('sk-loading');
      this.accountService.registerAccount(this.registerModel)
        .subscribe(
          (successResponse: RegisterModel) => {
            $registrationCard.toggleClass('sk-loading');
            console.log(successResponse);
            if (successResponse.isSucess) {
              toastr.success(successResponse.message, "Success");
              this.onUserAdded.emit("UserAdded");
            }
            else
              toastr.error(successResponse.message, "Error");

            this.sharedModel.isShowRegisterUserLoader = false;
          },
          (errorResponse: RegisterModel) => {
            $registrationCard.toggleClass('sk-loading');
            toastr.error(errorResponse.message, "Error");
            this.sharedModel.isShowRegisterUserLoader = false;
          });
    } else {
      toastr.info("Please fill all the fields properly.", "Info");
    }
  }

  onRoleChange(userRole: UserRole) {
    // this.registerModel.userRole = userRole;
  }

}
