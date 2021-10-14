import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-application',
  template: '<router-outlet></router-outlet>',
})
export class ApplicationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
