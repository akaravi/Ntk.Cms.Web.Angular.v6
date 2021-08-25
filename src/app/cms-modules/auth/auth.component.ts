import { Component, OnInit } from '@angular/core';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { environment } from 'src/environments/environment';
import { version } from '../../../../package.json';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  constructor(public publicHelper: PublicHelper,) {
  }
  today: Date = new Date();

  ngOnInit(): void {
  }

}
