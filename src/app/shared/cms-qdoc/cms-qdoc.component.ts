import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cms-qdoc',
  templateUrl: './cms-qdoc.component.html',
  styleUrls: ['./cms-qdoc.component.scss']
})
export class CmsQDocComponent implements OnInit {

  constructor(private cmsToastrService: CmsToastrService,
    public http: HttpClient,

  ) { }
  @Input() optionUrl = '';

  ngOnInit(): void {
  }
  QDocModel: any = {};
  onActionSendUrlToQDoc(): void {
    this.QDocModel.message = this.optionUrl;
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
}
