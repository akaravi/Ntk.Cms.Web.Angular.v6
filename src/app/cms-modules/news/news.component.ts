import {Component, OnInit} from '@angular/core';
import {Map} from 'leaflet';

@Component({
  selector: 'app-news',
  template: '<router-outlet></router-outlet>',
})
export class NewsComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
