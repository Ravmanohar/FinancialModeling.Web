// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// import { Observable, of as observableOf } from 'rxjs';
// import { AuthenticationService } from '../authentication.service';

// declare var toastr;
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuardService implements CanActivate {
//   constructor(private authService: AuthenticationService) { }

//   //Checks for token and processes the token for Identity
//   canActivate(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
//     var queryString = window.location.hash;
//     if (queryString != null && queryString.indexOf("id_token") > 0) {
//       this.authService.signInCallback();
//     }
//     var canActivate = true;
//     return observableOf(canActivate);
//   }

// }