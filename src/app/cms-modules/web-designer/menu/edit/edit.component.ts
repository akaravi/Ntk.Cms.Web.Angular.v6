import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  WebDesignerMainMenuService,
  WebDesignerMainMenuModel,
  AccessModel,
  DataFieldInfoModel,
  CoreUserGroupModel} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-webdesigner-menu-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class WebDesignerMainMenuEditComponent implements OnInit {
  requestId = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<WebDesignerMainMenuEditComponent>,
    public coreEnumService: CoreEnumService,
    public webDesignerMainMenuService: WebDesignerMainMenuService,
    private publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    if (data) {
      this.requestId = data.id + '';
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  appLanguage = 'fa';
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<WebDesignerMainMenuModel> = new ErrorExceptionResult<WebDesignerMainMenuModel>();
  dataModel: WebDesignerMainMenuModel = new WebDesignerMainMenuModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumMenuPlaceTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataAccessModel: AccessModel;
  fileManagerOpenForm = false;
  dataWebDesignerMainMenuModel: CoreUserGroupModel[];
  dataWebDesignerMainMenuIds: number[] = [];
  ngOnInit(): void {
    if (this.requestId.length > 0) {
      this.formInfo.formTitle = 'ویرایش  ';
      this.DataGetOneContent();
    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.getEnumRecordStatus();
    this.getEnumMenuPlaceType();
  }
  getEnumMenuPlaceType(): void {
    this.coreEnumService.ServiceEnumMenuPlaceType().subscribe((next) => {
      this.dataModelEnumMenuPlaceTypeResult = next;
    });
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }
  DataGetOneContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    /*َAccess Field*/
    this.webDesignerMainMenuService.setAccessLoad();
    this.webDesignerMainMenuService.ServiceGetOneById(this.requestId).subscribe(
      (next) => {
        /*َAccess Field*/
        this.dataAccessModel = next.access;
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.access);
        this.dataModel = next.item;
        if (next.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + next.item.title;
          this.formInfo.formAlert = '';
        } else {
          this.formInfo.formAlert = 'برروز خطا';
          this.formInfo.formError = next.errorMessage;
          this.cmsToastrService.typeerrorMessage(next.errorMessage);
        }
        this.loading.Stop(pName);
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );
  }
  DataEditContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName,this.translate.instant('MESSAGE.sending_information_to_the_server'));
    this.webDesignerMainMenuService.ServiceEdit(this.dataModel).subscribe(
      (next) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = next;
        if (next.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
          this.dialogRef.close({ dialogChangedDate: true });
        } else {
          this.formInfo.formAlert = 'برروز خطا';
          this.formInfo.formError = next.errorMessage;
          this.cmsToastrService.typeerrorMessage(next.errorMessage);
        }
        this.loading.Stop(pName);
      },
      (error) => {
        this.formInfo.formSubmitAllow = true;
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.DataEditContent();
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {
      if (!this.formGroup.valid) {
        this.cmsToastrService.typeErrorFormInvalid();
        setTimeout(() => {
          stepper.selectedIndex = event.previouslySelectedIndex;
          // stepper.previous();
        }, 10);
      }
    }
  }
  onActionSelectorSelect(model: WebDesignerMainMenuModel): void {
    this.dataModel.linkParentId = null;
    if (model && model.id.length > 0) {
      this.dataModel.linkParentId = model.id;
    }
  }
  onActionSelectorUserCategorySelect(model: CoreUserGroupModel[]): void {
    this.dataWebDesignerMainMenuModel = model;
  }
  onIconPickerSelect(model: any): void {
    this.dataModel.icon = model;
  }
}