import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services';
declare var jQuery: any;

@Component({
  selector: 'topnavbar',
  templateUrl: 'topnavbar.template.html',
  styleUrls: ['topnavbar.component.scss'],
})
export class TopNavbarComponent {

  constructor(private authService: AuthenticationService) {

  }

  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
  }

  onLogOut() {
    this.authService.onLogOut();
  }
}
