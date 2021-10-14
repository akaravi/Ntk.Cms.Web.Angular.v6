import {Component, OnInit} from '@angular/core';
import {Map} from 'leaflet';

@Component({
  selector: 'app-blog',
  template: '<router-outlet></router-outlet>',
})
export class BlogComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
