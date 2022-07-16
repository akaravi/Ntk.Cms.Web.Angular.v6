import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleLogMemoModel, CoreModuleLogMemoService, DataFieldInfoModel, EnumSortType, ErrorExceptionResult, FilterDataModel, FilterModel, FormInfoModel } from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';


@Component({
  selector: 'app-cms-memo',
  templateUrl: './cms-memo.component.html',
  styleUrls: ['./cms-memo.component.scss']
})
export class CmsMemoComponent implements OnInit {
  static nextId = 0;
  id = ++CmsMemoComponent.nextId;
  constructor(private cmsToastrService: CmsToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CmsMemoComponent>,
    public http: HttpClient,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
    public coreModuleLogMemoService: CoreModuleLogMemoService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestModuleName = data.moduleName;
      this.requestModuleEntityName = data.moduleEntityName;
      this.requestModuleEntityId = data.moduleEntityId;
      this.requestTitle = data.title;
    }
    else {
      this.dialogRef.close({ dialogChangedDate: true });
    }
    if (!this.requestModuleEntityId || !this.requestModuleEntityName || !this.requestModuleName)
      this.dialogRef.close({ dialogChangedDate: true });
    this.dataModel.moduleEntityId = this.requestModuleEntityId;
    this.dataModel.moduleName = this.requestModuleName;
    this.dataModel.moduleEntityName = this.requestModuleEntityName;

  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  showAdd: boolean = true;

  loading = new ProgressSpinnerModel();
  requestModuleName: string;
  requestModuleEntityName: string;
  requestModuleEntityId: string;
  requestTitle: string;
  dataModelResult: ErrorExceptionResult<CoreModuleLogMemoModel> = new ErrorExceptionResult<CoreModuleLogMemoModel>();
  dataModel: CoreModuleLogMemoModel = new CoreModuleLogMemoModel();



  ngOnInit(): void {
    this.DataGetAll();
  }
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  formInfo: FormInfoModel = new FormInfoModel();
  DataGetAll(): void {
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.get_information_list'));

    /*filter CLone*/
    var filterModel = new FilterModel();
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

    filterModel.accessLoad = true;
    /*filter CLone*/
    this.coreModuleLogMemoService.ServiceGetAll(filterModel).subscribe({
      next: (ret) => {
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
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

  DataAddContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.coreModuleLogMemoService.ServiceAdd(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        // this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessAdd();
          this.dialogRef.close({ dialogChangedDate: true });

        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
          this.cmsToastrService.typeErrorMessage(ret.errorMessage);
        }
        this.loading.Stop(pName);

      },
      error: (er) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(er);
        this.loading.Stop(pName);
      }
    }
    );
  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.DataAddContent();
  }

  onActionAdd() {
    this.showAdd = !this.showAdd
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });

  }

}
