import { Injectable } from '@angular/core';
import { HttpClient } from '../index';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { RegisterModel, LoginModel, LoggedInUser } from '../models';

import { AuthenticationService } from 'src/app/services/authentication.service';
import { AppConfig } from 'src/app/services/config.service';
import { SharedModelService } from '.';
import { UserDto } from '../models/user-model';
import { ResetUserPasswordModel } from '../models/account.model';

declare var $;
declare var toastr;

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private apiUrl: string;
  private authUrl: string;
  constructor(
    private authService: AuthenticationService,
    private appConfig: AppConfig,
    private sharedModel: SharedModelService,
    private http: HttpClient) {
    this.apiUrl = this.appConfig.config.apiUrl;
    this.authUrl = this.appConfig.config.authUrl;
  }

  registerAccount(registerModel: RegisterModel) {
    var url = this.apiUrl + '/account/register';
    return this.http.post(url, registerModel);
  }

  loginAccount(loginModel: LoginModel) {
    var $loginCard = $('#login-card');
    $loginCard.toggleClass('sk-loading');

    var url = this.authUrl + '/TOKEN';
    console.log(url);
    $.ajax({
      type: "POST",
      url: url,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        // 'Access-Control-Allow-Origin': 'http://localhost:4200',
      },
      data: $.param({ grant_type: 'password', username: loginModel.email, password: loginModel.password }),
    }).done((token) => {
      this.authService.setAuthToken(token);
      this.getUser().subscribe((loggedInUser: LoggedInUser) => {
        console.log(loggedInUser);
        $loginCard.toggleClass('sk-loading');
        if (loggedInUser.isActive) {
          this.authService.setLoggedInUser(loggedInUser);
        } else {
          toastr.error("Your account is Deactivated", "Info");
          this.authService.goToLogin();
        }
      }, error => {
        console.error(error);
      });
    }).fail((jqXHR, textStatus, errorThrown) => {
      console.log(jqXHR, textStatus, errorThrown);
      $loginCard.toggleClass('sk-loading');
      toastr.error(textStatus, "Error");
    });
  }

  getUsersByClientId(clientId: number) {
    var apiPath = this.apiUrl + '/Admin/GetUsersByClientId?clientId=' + clientId;
    return this.http.get(apiPath);
  }

  getUser() {
    var apiPath = this.apiUrl + '/Admin/GetUser';
    return this.http.get(apiPath);
  }

  onUserStatusChange(user: UserDto) {
    var apiPath = this.apiUrl + '/Admin/DeleteUser?userId=' + user.userId + '&isActive=' + user.isActive;
    return this.http.post(apiPath, null);
  }

  resetUserPassword(model: ResetUserPasswordModel) {
    var url = this.apiUrl + '/account/ResetUserPassword';
    return this.http.post(url, model);
  }

}
