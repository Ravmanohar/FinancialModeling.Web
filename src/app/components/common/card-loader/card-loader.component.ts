import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'card-loader',
  templateUrl: './card-loader.component.html',
  styleUrls: ['./card-loader.component.scss']
})
export class CardLoaderComponent implements OnInit {

  constructor() { }

  loaderName: string = 'FadingCircle';
  ngOnInit() {
    this.loaderName = 'FadingCircle';
  }

}
