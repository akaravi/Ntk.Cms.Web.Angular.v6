import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleLogMemoModel, CoreModuleLogMemoService, DataFieldInfoModel, EnumSortType, ErrorExceptionResult, FilterDataModel, FilterModel } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
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
    public publicHelper: PublicHelper,
    public translate: TranslateService,
    public contentService: CoreModuleLogMemoService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestModuleName = data.ModuleName;
      this.requestModuleEntityName = data.ModuleEntityName;
      this.requestModuleEntityId = data.ModuleEntityId;
      this.requestTitle = data.title
    }
    else
    {
      this.dialogRef.close({ dialogChangedDate: true });
    }
    if(!this.requestModuleEntityId|| !this.requestModuleEntityName ||!this.requestModuleName)
    this.dialogRef.close({ dialogChangedDate: true });

  }
  loading = new ProgressSpinnerModel();
  requestModuleName: string;
  requestModuleEntityName: string;
  requestModuleEntityId: string;
  requestTitle: string;
  dataModelResult: ErrorExceptionResult<CoreModuleLogMemoModel> = new ErrorExceptionResult<CoreModuleLogMemoModel>();

  ngOnInit(): void {
    this.DataGetAll();
  }
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  DataGetAll(): void {

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));

    /*filter CLone*/
   var  filterModel = new FilterModel();
     /*filter Sort*/
     filterModel.sortColumn = 'CreatedDate';
     filterModel.sortType = EnumSortType.Descending;
     const filter1 = new FilterDataModel(); 
     filter1.propertyName = 'ModuleName';
     filter1.value = this.requestModuleName;
     filterModel.filters.push(filter1);

     const filter2 = new FilterDataModel(); 
     filter2.propertyName = 'ModuleEntityName';
     filter2.value = this.requestModuleEntityName;
     filterModel.filters.push(filter2);

     const filter3 = new FilterDataModel(); 
     filter3.propertyName = 'ModuleEntityId';
     filter3.value = this.requestModuleEntityId;
     filterModel.filters.push(filter3);

     filterModel.accessLoad=true;
    /*filter CLone*/
    this.contentService.ServiceGetAllEditor(filterModel).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);

          this.dataModelResult = ret;
        } else {
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);

      },
      error: (er) => {
        this.cmsToastrService.typeError(er);

        this.loading.Stop(pName);
      }
    }
    );
  }

  onActionbuttonNewRow(): void {

    if (
      this.dataModelResult == null ||
      this.dataModelResult.access == null ||
      !this.dataModelResult.access.accessAddRow
    ) {
      this.cmsToastrService.typeErrorAccessAdd();
      return;
    }
   

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
