import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  constructor(public publicHelper: PublicHelper, private cdr: ChangeDetectorRef) {
  }
  today: Date = new Date();
  public innerWidth = 0;
  showSplashModel = true;
  ngOnInit(): void {
    this.innerWidth = + window.innerWidth;
    console.log(this.innerWidth);
    if (this.innerWidth < 1000) {
      setTimeout(() => {
        this.showSplashModel = false;
        this.cdr.markForCheck();
      }, 5000);
    }
  }

}
