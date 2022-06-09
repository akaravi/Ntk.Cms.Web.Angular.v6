import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-memo',
  templateUrl: './cms-memo.component.html',
  styleUrls: ['./cms-memo.component.scss']
})
export class CmsMemoComponent implements OnInit {
  constructor(private cmsToastrService: CmsToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CmsMemoComponent>,
    public http: HttpClient,
    private router: Router,
    public translate: TranslateService,
  ) {
    if (data) {
      // this.optionTitle = data.Title;
      // this.optionUrlViewContentQRCodeBase64 = data.UrlViewContentQRCodeBase64;
      this.LinkSiteId = data.LinkSiteId;
    }
   }
  // @Input() optionTitle = '';
  // @Input() optionUrlViewContentQRCodeBase64 = '';
  // @Input() optionUrlViewContent = '';
  @Input() LinkSiteId = '';
  QDocModel: any = {};
  ngOnInit(): void {
  }

  onActionbuttonNewRow(): void {

      if (
        this.dataModelResult == null ||
        this.dataModelResult.Access == null ||
        !this.dataModelResult.Access.AccessAddRow
      ) {
        this.cmsToastrService.typeErrorAccessAdd();
        return;
      }
      const dialogRef = this.dialog.open(CoreModuleLogMemoAddComponent, {
        height: '90%',
        data: {
          LinkSiteId: this.requestLinkSiteId,
        }
      });
      // dialogRef.afterClosed().subscribe(result => {
      //   if (result && result.dialogChangedDate) {
      //     this.DataGetAll();
      //   }
      // });
    }

  // onActionSendUrlToQDoc(): void {
  //   this.QDocModel.message = this.optionUrlViewContent;
  //   if (!this.QDocModel.username && this.QDocModel.username.length <= 0) {
  //     const message = 'کد شناسه را از وبسایت https://Qdoc.ir دریافت نمایید';
  //     this.cmsToastrService.typeWarningSelected(message);
  //     return;
  //   }
  //   this.http.post(environment.cmsServerConfig.configQDocServerPath, this.QDocModel, {
  //     headers: {},
  //   })
  //     .pipe(
  //       map((ret: any) => {
  //         this.cmsToastrService.typeSuccessMessage(this.translate.instant('MESSAGE.The_order_was_sent_to_the_website'));
  //       })
  //       // 
  //       //   this.cmsToastrService.typeErrorMessage('برروز خطا در ارسال دستور');
  //       // 
  //     ).toPromise();
  // }
  // onActionCopied(): void {
  //   this.cmsToastrService.typeSuccessCopedToClipboard();
  // }
  // onActionOpenLink():void{
  //   const url = this.router.serializeUrl(
  //     this.router.createUrlTree([this.optionUrlViewContent])
  //   );
  //   window.open(this.optionUrlViewContent, '_blank');
  // }
}
