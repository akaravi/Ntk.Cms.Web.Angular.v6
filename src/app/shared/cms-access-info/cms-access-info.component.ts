import { ChangeDetectorRef, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccessModel, CoreGuideService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cms-access-info',
  templateUrl: './cms-access-info.component.html',
})
export class CmsAccessInfoComponent implements OnInit {
  static nextId = 0;
  id = ++CmsAccessInfoComponent.nextId;
  @Input() access: AccessModel;
  @Input() title: string;
  body: string;
  @Input() classes: string;
  @Input() icon: string;
  @Input() svg: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private tokenHelper: TokenHelper,
    private cdr: ChangeDetectorRef,
    private cmsToastrService: CmsToastrService,
  ) {
    if (data && data.access) {
      this.access = data.access;
    }
  }
  ngOnInit(): void {

  }

  bodyShow = true;
  onActionBottunClick() {
    this.bodyShow = true;
    this.cdr.detectChanges();
  }
  onActionCloseBottunClick() {
    this.bodyShow = false;
    this.cdr.detectChanges();
  }
}
