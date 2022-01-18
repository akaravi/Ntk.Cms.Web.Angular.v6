import {Component, OnInit} from '@angular/core';
import {Map} from 'leaflet';
@Component({
  selector: 'app-chart',
  template: '<router-outlet></router-outlet>',
})
export class ChartComponent implements OnInit {
  constructor() {
  }
  ngOnInit(): void {
  }

}
