
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import {
  ChangeDetectorRef, Component, Inject, OnInit,
  ViewChild
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessModel, CoreEnumService, CoreGuideModel, CoreGuideService, DataFieldInfoModel, EnumInfoModel, EnumManageUserAccessDataTypes, ErrorExceptionResult,
  FormInfoModel
} from 'ntk-cms-api';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-core-guide-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class CoreGuideEditComponent implements OnInit {
  requestId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreGuideEditComponent>,
    public coreEnumService: CoreEnumService,
    public coreGuideService: CoreGuideService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    if (data) {
      this.requestId = +data.id || 0;
    }

  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  appLanguage = 'fa';

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreGuideModel> = new ErrorExceptionResult<CoreGuideModel>();
  dataModel: CoreGuideModel = new CoreGuideModel();

  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataAccessModel: AccessModel;

  selectFileTypePodcast = ['mp3'];
  selectFileTypeMovie = ['mp4', 'webm'];

  fileManagerTree: TreeModel;

  fileManagerOpenForm = false;
  fileManagerOpenFormPodcastFa = false;
  fileManagerOpenFormMovieFa = false;
  fileManagerOpenFormPodcastEn = false;
  fileManagerOpenFormMovieEn = false;
  fileManagerOpenFormPodcastAr = false;
  fileManagerOpenFormMovieAr = false;
  fileManagerOpenFormPodcastDe = false;
  fileManagerOpenFormMovieDe = false;

  dataCoreGuideIds: number[] = [];

  ngOnInit(): void {
    if (this.requestId > 0) {
      this.formInfo.formTitle = this.translate.instant('TITLE.Edit');
      this.DataGetOneContent();
    } else {
      this.cmsToastrService.typeErrorComponentAction();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }

    this.getEnumRecordStatus();
  }

  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }
  DataGetOneContent(): void {
    if (this.requestId <= 0) {
      this.cmsToastrService.typeErrorEditRowIsNull();
      return;
    }

    this.formInfo.formAlert = this.translate.instant('MESSAGE.Receiving_Information_From_The_Server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    /*َAccess Field*/
    this.coreGuideService.setAccessLoad();
    this.coreGuideService.setAccessDataType(EnumManageUserAccessDataTypes.Editor);
    this.coreGuideService.ServiceGetOneById(this.requestId).subscribe({
      next: (ret) => {
        /*َAccess Field*/
        this.dataAccessModel = ret.access;
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        this.dataModel = ret.item;
        if (ret.isSuccess) {
          this.formInfo.formTitle = this.formInfo.formTitle + ' ' + ret.item.titleFa;
          this.formInfo.formAlert = '';
        } else {
          this.formInfo.formAlert = this.translate.instant('ERRORMESSAGE.MESSAGE.typeError');
          this.formInfo.formError = ret.errorMessage;
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

  DataEditContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName, this.translate.instant('MESSAGE.sending_information_to_the_server'));

    this.coreGuideService.ServiceEdit(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
        if (ret.isSuccess) {
          this.formInfo.formAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
          this.cmsToastrService.typeSuccessEdit();
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

  onActionFileSelectedLinkFilePodcastIdFa(model: NodeInterface): void {
    this.dataModel.linkFilePodcastIdFa = model.id;
    this.dataModel.linkFilePodcastIdFaSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileMovieIdFa(model: NodeInterface): void {
    this.dataModel.linkFileMovieIdFa = model.id;
    this.dataModel.linkFileMovieIdFaSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFilePodcastIdEn(model: NodeInterface): void {
    this.dataModel.linkFilePodcastIdEn = model.id;
    this.dataModel.linkFilePodcastIdEnSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileMovieIdEn(model: NodeInterface): void {
    this.dataModel.linkFileMovieIdEn = model.id;
    this.dataModel.linkFileMovieIdEnSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFilePodcastIdAr(model: NodeInterface): void {
    this.dataModel.linkFilePodcastIdAr = model.id;
    this.dataModel.linkFilePodcastIdArSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileMovieIdAr(model: NodeInterface): void {
    this.dataModel.linkFileMovieIdAr = model.id;
    this.dataModel.linkFileMovieIdArSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFilePodcastIdDe(model: NodeInterface): void {
    this.dataModel.linkFilePodcastIdDe = model.id;
    this.dataModel.linkFilePodcastIdDeSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkFileMovieIdDe(model: NodeInterface): void {
    this.dataModel.linkFileMovieIdDe = model.id;
    this.dataModel.linkFileMovieIdDeSrc = model.downloadLinksrc;
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

  onActionSelectorSelect(model: CoreGuideModel): void {
    this.dataModel.linkParentId = null;
    if (model && model.id > 0) {
      this.dataModel.linkParentId = model.id;
    }
  }



}
