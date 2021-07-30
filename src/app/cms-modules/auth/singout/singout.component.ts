import { Component, OnInit } from '@angular/core';
import { CoreAuthService } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-auth-singout',
  templateUrl: './singout.component.html',
  styleUrls: ['./singout.component.scss'],
})
export class AuthSingoutComponent implements OnInit {
  constructor(private authService: CoreAuthService,
              private cmsToastrService: CmsToastrService,
  ) {
    this.authService.ServiceLogout().subscribe((next) => {
      if (next.IsSuccess) {
        this.cmsToastrService.typeSuccessLogout();

      }
    });
  }

  ngOnInit(): void { }
}
