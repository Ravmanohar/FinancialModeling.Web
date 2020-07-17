import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedInUser } from '../models/account.model';

declare var $;
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private router: Router) {
    this.setUser();
  }

  public setUser() {
    this.isLoggedIn = false;
    this.loggedInUser = new LoggedInUser();
    var loggedInUserString = localStorage.getItem("LoggedInUser");
    if (loggedInUserString != null) {
      this.loggedInUser = JSON.parse(loggedInUserString);
      this.isLoggedIn = true;
    }
  }

  public isLoggedIn: boolean = false;
  isAuthenticated() {
    var token = this.getToken();
    return token != null;
  }

  setLoggedInUser(loggedInUser: LoggedInUser) {
    localStorage.setItem("LoggedInUser", JSON.stringify(loggedInUser));
    this.loggedInUser = loggedInUser;
    this.isLoggedIn = true;
    this.navigateByUserRole();
  }

  navigateByUserRole() {
    switch (this.loggedInUser.role) {
      case "Admin":
        this.router.navigate(['/view-clients']);
        break;
      case "User":
        this.router.navigate(['/projections']);
        break;
      default:
        this.router.navigate(['/view-clients']);
        break;
    }
  }

  loggedInUser: LoggedInUser;

  onLogIn(token: any) {
    this.setAuthToken(token);
    this.isLoggedIn = true;
    this.router.navigate(['/dashboard']);
  }

  onLogOut() {
    this.isLoggedIn = false;
    this.clearAuthToken();
    this.router.navigate(['/login']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegisterAccount() {
    this.router.navigate(['/register']);
  }

  setAuthToken(token: any) {
    localStorage.setItem('token', JSON.stringify(token));
  }

  clearAuthToken() {
    localStorage.clear();
  }

  getToken() {
    var token = JSON.parse(localStorage.getItem('token'));
    return token == null ? null : token.access_token;
  }

}