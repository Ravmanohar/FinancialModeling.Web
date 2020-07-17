import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of as observableOf } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

declare var toastr;
@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {
  constructor(private authService: AuthenticationService) { }

  //Check If User Is Logged in and user has role and permissions for route
  canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    var allowedRoles = activatedRouteSnapshot.data["roles"];
    var canActivate = false;

    if (canActivate == false && this.authService.isAuthenticated() == false) {
      this.authService.goToLogin();
      return observableOf(false);
    }

    if (allowedRoles && allowedRoles.indexOf("All") >= 0)
      canActivate = true;

    if (allowedRoles && allowedRoles.indexOf(this.authService.loggedInUser.role) >= 0)
      canActivate = true;

    return observableOf(canActivate);
  }

}
