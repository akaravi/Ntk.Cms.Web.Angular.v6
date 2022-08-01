import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccessModel } from 'ntk-cms-api';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

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
    private dialogRef: MatDialogRef<CmsAccessInfoComponent>,
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

  bodyShow = false;
  onActionMoreBottunClick() {
    this.bodyShow = true;
    this.cdr.detectChanges();
  }
  onActionLessBottunClick() {
    this.bodyShow = false;
    this.cdr.detectChanges();
  }
  onActionCloseBottunClick() {
    this.dialogRef.close({ dialogChangedDate: false });
    this.cdr.detectChanges();
  }
  detectColor(value: boolean) {
    if (value === true)
      return "table-success"

    return "table-danger"

  }
}
