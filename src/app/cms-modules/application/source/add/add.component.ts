//**msh */
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import {
  AccessModel,
  ApplicationEnumService,
  ApplicationSourceModel,
  ApplicationSourceService,
  CoreEnumService,
  DataFieldInfoModel,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { NodeInterface, TreeModel } from 'src/filemanager-api';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-aplication-source-add',
  templateUrl: './add.component.html',
})
export class ApplicationSourceAddComponent implements OnInit {
  constructor(
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    public applicationEnumService: ApplicationEnumService,
    private applicationSourceService: ApplicationSourceService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    private router: Router) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModel = new ApplicationSourceModel();
  dataModelResult: ErrorExceptionResult<ApplicationSourceModel> = new ErrorExceptionResult<ApplicationSourceModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumOsTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerOpenForm = false;
  appLanguage = 'fa';
  fileManagerTree: TreeModel;
  ngOnInit(): void {
    this.DataGetAccess();
    this.getEnumRecordStatus();
    this.getEnumOsType();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }
  getEnumOsType(): void {
    this.applicationEnumService.ServiceEnumOSType().subscribe((res) => {
      this.dataModelEnumOsTypeResult = res;
    });
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }
    this.DataAddContent();
  }
  DataGetAccess(): void {
    this.applicationSourceService
      .ServiceViewModel()
      .subscribe({
        next: (ret) => {
          if (ret.IsSuccess) {
            this.dataAccessModel = ret.Access;
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.Access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(ret.ErrorMessage);
          }
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetAccess(er);
        }
      }
      );
  }
  DataAddContent(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);
    this.applicationSourceService
      .ServiceAdd(this.dataModel)
      .subscribe({
        next: (ret) => {
          this.formInfo.FormSubmitAllow = !ret.IsSuccess;
          this.dataModelResult = ret;
          if (ret.IsSuccess) {
            this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
            this.cmsToastrService.typeSuccessAdd();
            setTimeout(() => this.router.navigate(['/application/source/']), 1000);
          } else {
            this.cmsToastrService.typeErrorAdd(ret.ErrorMessage);
          }
          this.loading.Stop(pName);
        },
        error: (er) => {
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorAdd(er);
          this.loading.Stop(pName);
        }
      }
      );
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
  onActionBackToParent(): void {
    this.router.navigate(['/application/source/']);
  }
  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;
  }
  onActionSourceCopySelect(model: ApplicationSourceModel | null): void {
    if (!model || model.Id <= 0) {
      const message = this.translate.instant('MESSAGE.category_of_information_is_not_clear');
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.dataModel = model;
  }
}