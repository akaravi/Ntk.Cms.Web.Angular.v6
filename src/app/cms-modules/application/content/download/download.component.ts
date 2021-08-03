import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationAppModel, ApplicationAppService, FormInfoModel } from 'ntk-cms-api';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class ApplicationAppDownloadComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public dataModel: ApplicationAppModel,
              private dialogRef: MatDialogRef<ApplicationAppDownloadComponent>,
              private applicationAppService: ApplicationAppService,
              private cmsToastrService: CmsToastrService,
              private translate: TranslateService,
                ) {

  }
  formInfo: FormInfoModel = new FormInfoModel();
  loading = new ProgressSpinnerModel();
  // dataModel = new ApplicationAppModel();

  ngOnInit(): void {
    this.DataGetOne(this.dataModel.Id);
  }
  DataGetOne(requestId: number): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.get_information_from_the_server');
    this.formInfo.FormError = '';
    this.loading.Start("main");

    this.applicationAppService
      .ServiceGetOneById(requestId)
      .subscribe(
        async (next) => {
          this.loading.Stop("main");
          this.formInfo.FormSubmitAllow = true;
          if (next.IsSuccess) {
            this.dataModel = next.Item;

          } else {
            this.cmsToastrService.typeErrorGetOne(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.Stop("main");
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorGetOne(error);
        }
      );
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onActionDownloadApp(): void{
    window.open(this.dataModel.DownloadLinkSrc);

  }
  onActionDownloadUpdate(): void{
    window.open(this.dataModel.DownloadLinkUpdateSrc);

  }
}
