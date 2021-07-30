import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  constructor() {
    this.appVersion = environment.appVersion;
  }
  appVersion = '';
  today: Date = new Date();

  ngOnInit(): void {
  }

}
