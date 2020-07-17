import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services';
// import { smoothlyMenu } from '../../../app.helpers';
declare var jQuery: any;

@Component({
  selector: 'topnavigationnavbar',
  templateUrl: 'topnavigationnavbar.template.html'
})
export class TopNavigationNavbarComponent {
  constructor(private authService: AuthenticationService) {

  }

  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    // smoothlyMenu();
  }

  onLogOut() {
    this.authService.onLogOut();
  }

}
