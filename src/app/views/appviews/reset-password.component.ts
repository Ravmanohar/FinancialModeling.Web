import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { AuthenticationService, SharedModelService } from '../../services';
import { RegisterModel, UserRole } from 'src/app/models';
import { LookupService } from 'src/app/services/lookup.service';
import { UserDto } from 'src/app/models/user-model';
import { AccountService } from 'src/app/services/account.service';
import { ResetUserPasswordModel } from 'src/app/models/account.model';

declare var toastr;
declare var $;
@Component({
  selector: 'app-reset-password',
  templateUrl: 'reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  @Input() userId: string = null;
  @Output() onPasswordReset: EventEmitter<string> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private accountService: AccountService,
    public sharedModel: SharedModelService,
    private authenticationService: AuthenticationService
  ) {
  }

  isShowResetPasswordLoader: boolean = false;
  public resetPasswordForm: FormGroup = this.formBuilder.group({
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });
  resetUserPasswordModel: ResetUserPasswordModel = new ResetUserPasswordModel();

  ngOnInit() {

  }

  onResetPassword() {
    console.log(this.resetPasswordForm);
    // $("#reset-password-modal").modal('hide');
    if (this.resetPasswordForm.valid) {
      this.resetUserPasswordModel = this.resetPasswordForm.value;
      this.resetUserPasswordModel.userId = this.userId;
      this.isShowResetPasswordLoader = true;

      var $resetPasswordCard = $('#reset-password-card');
      $resetPasswordCard.addClass('sk-loading');
      this.accountService.resetUserPassword(this.resetUserPasswordModel)
        .subscribe(
          (successResponse: ResetUserPasswordModel) => {
            console.log(successResponse);
            $resetPasswordCard.removeClass('sk-loading');
            toastr.success("User Password Reset Successfully", "Success");
            this.isShowResetPasswordLoader = false;
            $("#reset-password-modal").modal('hide');
            this.resetPasswordForm.reset();
          },
          (errorResponse: RegisterModel) => {
            $resetPasswordCard.removeClass('sk-loading');
            if (errorResponse && errorResponse['error'] && errorResponse['error'].modelState) {
              var modelState = errorResponse['error'].modelState;
              if (modelState) {
                var newPassword = modelState['model.NewPassword'];
                if (newPassword)
                  toastr.error(newPassword.join(''), "Error");
                var confirmPassword = modelState['model.ConfirmPassword'];
                if (confirmPassword)
                  toastr.error(confirmPassword.join(''), "Error");

                if (modelState[""])
                  toastr.error(modelState[""].join(), "Error");
              }
            }
            this.isShowResetPasswordLoader = false;
          });
    } else {
      toastr.info("Please fill all the fields properly.", "Info");
    }
  }
}
