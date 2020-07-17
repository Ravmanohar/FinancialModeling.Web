import { Injectable, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { AuthenticationService } from './index';

declare var $;
declare var moment;

@Injectable({
  providedIn: 'root'
})
export class SharedModelService {

  constructor(private http: HttpClient
    // , private authService: AuthenticationService
  ) {
    this.init();
  }

  isAuthenticated: boolean = false;
  isShowRegisterUserLoader: boolean = false;

  init() {

  }

  getTabsInfo() {
    return this.http.get('api path')
  }

  showMessage(options) {
    // //Toaster message available options
    // var options = {
    //   interval: 3,
    //   bgColor: '#dd4b39',
    //   color: '#ffffff',
    //   top: '0px',
    //   width: '300px',
    //   message: 'Toaster Message',
    //   type: msgType.error
    //   css: {propName: value}
    // };
    $.showMessage(options);
  }

}
