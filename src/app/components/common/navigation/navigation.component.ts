import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services';
import { LoggedInUser } from 'src/app/models/account.model';

declare var $: any;

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.template.html',
  styleUrls: ['navigation.component.scss'],
})

export class NavigationComponent {

  constructor(public authService: AuthenticationService, private router: Router) { }
  menuList: any = [];
  // menuList: any = [
  //   { "title": "Home", "path": "./starterview", "route": "starterview", "icon": "fa fa-th-large" },
  //   { "title": "Dashboard", "path": "./dashboard", "route": "dashboard", "icon": "fa fa-th-large" },
  //   // { "title": "Setup Client", "path": "./setup-client", "route": "setup-client", "icon": "fa fa-car" },
  //   // { "title": "Clients", "path": "./client-list", "route": "client-list", "icon": "fa fa-users" },
  //   // { "title": "Users", "path": "./users", "route": "users", "icon": "fa fa-user" },
  //   { "title": "Clients", "path": "./view-clients", "route": "view-clients", "icon": "fa fa-users" },
  //   // { "title": "Users", "path": "./users", "route": "users", "icon": "fa fa-users" },
  //   // { "title": "Report", "path": "./report", "route": "report", "icon": "fa fa-th-large" },
  // ];

  ngOnInit() {
    if (this.authService.loggedInUser.role == "Admin") {
      this.menuList = [
        { "title": "Home", "path": "./dashboard-report", "route": "dashboard-report", "icon": "fa fa-home" },
        // { "title": "Dashboard", "path": "./dashboard", "route": "dashboard", "icon": "fa fa-th-large" },
        { "title": "Clients", "path": "./view-clients", "route": "view-clients", "icon": "fa fa-users" },
      ];
    } else {
      this.menuList = [
        { "title": "Home", "path": "./dashboard-report", "route": "dashboard-report", "icon": "fa fa-home" },
        // { "title": "Dashboard", "path": "./dashboard", "route": "dashboard", "icon": "fa fa-th-large" },
        { "title": "Projections", "path": "./projections", "route": "projections", "icon": "fa fa-th-large" },
      ];
    }
  }

  ngAfterViewInit() {
    $('#side-menu').metisMenu();

    if ($("body").hasClass('fixed-sidebar')) {
      $('.sidebar-collapse').slimscroll({
        height: '100%'
      })
    }
  }

  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  onRouterLinkClick(path: string) {
    this.router.navigate([path]);
  }

  onLogOut() {
    this.authService.onLogOut();
  }

}
