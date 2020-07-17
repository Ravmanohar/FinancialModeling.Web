import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor() { }

  loaderName: LoaderName = LoaderName.FadingCircle;//Wave

  FadingCircle: LoaderName = LoaderName.FadingCircle;//Wave
  Wave: LoaderName = LoaderName.Wave;//Wave
  ngOnInit() {

  }

}


export enum LoaderName {
  FadingCircle = 1,
  Wave = 1,
}