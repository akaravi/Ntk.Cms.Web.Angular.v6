import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cms-link-to',
  templateUrl: './cms-link-to.component.html',
  styleUrls: ['./cms-link-to.component.scss']
})
export class CmsLinkToComponent implements OnInit {
  static nextId = 0;
  id = ++CmsLinkToComponent.nextId;
  constructor(private cmsToastrService: CmsToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CmsLinkToComponent>,
    public http: HttpClient,
    private router: Router,
  ) {
    if (data) {
      this.optionTitle = data.title;
      this.optionurlViewContentQRCodeBase64 = data.urlViewContentQRCodeBase64;
      this.optionurlViewContent = data.urlViewContent;
    }
   }
  @Input() optionTitle = '';
  @Input() optionurlViewContentQRCodeBase64 = '';
  @Input() optionurlViewContent = '';
  QDocModel: any = {};
  ngOnInit(): void {
  }
  onActionSendUrlToQDoc(): void {
    this.QDocModel.message = this.optionurlViewContent;
    if (!this.QDocModel.username && this.QDocModel.username.length <= 0) {
      const message = 'کد شناسه را از وبسایت https://Qdoc.ir دریافت نمایید';
      this.cmsToastrService.typeWarningSelected(message);
      return;
    }
    this.http.post(environment.cmsServerConfig.configQDocServerPath, this.QDocModel, {
      headers: {},
    })
      .pipe(
        map((ret: any) => {
          this.cmsToastrService.typeSuccessMessage('دستور به وب سایت ارسال شد');
        })
        // 
        //   this.cmsToastrService.typeErrorMessage('برروز خطا در ارسال دستور');
        // 
      ).toPromise();
  }
  onActionCopied(): void {
    this.cmsToastrService.typeSuccessCopedToClipboard();
  }
  onActionOpenLink():void{
    const url = this.router.serializeUrl(
      this.router.createUrlTree([this.optionurlViewContent])
    );
    window.open(this.optionurlViewContent, '_blank');
  }
}
