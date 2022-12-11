import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleEntityReportFileModel, ErrorExceptionResult, FormInfoModel, IApiCmsServerBase, TokenInfoModel } from 'ntk-cms-api';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, Subscription, switchMap } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-print-entity',
  templateUrl: './cms-print-entity.component.html'
})
export class CmsPrintEntityComponent implements OnInit {
  static nextId = 0;
  id = ++CmsPrintEntityComponent.nextId;
  constructor(private cmsToastrService: CmsToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CmsPrintEntityComponent>,
    public http: HttpClient,
    private router: Router,
    public translate: TranslateService,
    private tokenHelper: TokenHelper,
  ) {
    if (data) {
      this.optionService = data.service;
    }
  }
  dataModelResult: ErrorExceptionResult<CoreModuleEntityReportFileModel> = new ErrorExceptionResult<CoreModuleEntityReportFileModel>();
  
  _loading: ProgressSpinnerModel = new ProgressSpinnerModel();
  get loading(): ProgressSpinnerModel {
    return this._loading;
  }
  @Input() set loading(value: ProgressSpinnerModel) {
    this._loading = value;
  }

  optionService : IApiCmsServerBase;
  optionPlaceholder = '';
  formControl = new FormControl();
  filteredOptions: Observable<CoreModuleEntityReportFileModel[]>;
  dataModelSelect: CoreModuleEntityReportFileModel = new CoreModuleEntityReportFileModel();

  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    this.loadOptions();
  }
  loadOptions(): void {
    this.filteredOptions = this.formControl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(1500),
        distinctUntilChanged(),
        switchMap(val => {
          return this.DataGetAll();
        }),
        // tap(() => this.myControl.setValue(this.options[0]))
      );
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  displayFn(model?: CoreModuleEntityReportFileModel): string | undefined {
    return model ? (model.title ) : undefined;
  }
  displayOption(model?: CoreModuleEntityReportFileModel): string | undefined {
    return model ? (model.title) : undefined;
  }
  async DataGetAll(): Promise<CoreModuleEntityReportFileModel[]> {
    
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    return await this.optionService.ServiceGetAllReportFile()
      .pipe(
        map(response => {
          this.dataModelResult = response;
          this.loading.Stop(pName);
          return response.listItems;
        })
      ).toPromise();
  }
  onActionSelect(model: CoreModuleEntityReportFileModel): void {
    this.dataModelSelect = model;
  }
  onActionSelectClear(): void {
    this.formControl.setValue(null);
  }
  onFormSubmit(): void {
    
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
