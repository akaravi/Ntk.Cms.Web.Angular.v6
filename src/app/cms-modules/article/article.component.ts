import {Component, OnInit} from '@angular/core';
import {Map} from 'leaflet';

@Component({
  selector: 'app-article',
  template: '<router-outlet></router-outlet>',
})
export class ArticleComponent implements OnInit {

  
  constructor() {
  }

  ngOnInit(): void {
  }

}
