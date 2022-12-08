
import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  CoreGuideService,
  CoreGuideModel,
  DataFieldInfoModel,
} from 'ntk-cms-api';
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
import { TranslateService } from '@ngx-translate/core';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';

@Component({
  selector: 'app-core-guide-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class CoreGuideAddComponent implements OnInit {
  requestParentId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreGuideAddComponent>,
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
      this.requestParentId = +data.parentId || 0;
    }
    if (this.requestParentId > 0) {
      this.dataModel.linkParentId = this.requestParentId;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();


  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreGuideModel> = new ErrorExceptionResult<CoreGuideModel>();
  dataModel: CoreGuideModel = new CoreGuideModel();


  formInfo: FormInfoModel = new FormInfoModel();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();

  selectFileTypePodcast = ['mp3'];
  selectFileTypeMovie = ['mp4', 'webm'];

  fileManagerTree: TreeModel;

  appLanguage = 'fa';
  fileManagerOpenForm = false;
  fileManagerOpenFormPodcast = false;
  fileManagerOpenFormMovie = false;



  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.ADD');
    this.getEnumRecordStatus();
    this.DataGetAccess();

  }

  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }

  DataGetAccess(): void {
    this.coreGuideService
      .ServiceViewModel()
      .subscribe({
        next: (ret) => {
          if (ret.isSuccess) {
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(ret.errorMessage);
          }
        },
        error: (er) => {
          this.cmsToastrService.typeErrorGetAccess(er);
        }
      }
      );
  }

  DataAddContent(): void {
    this.formInfo.formAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.formError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.coreGuideService.ServiceAdd(this.dataModel).subscribe({
      next: (ret) => {
        this.formInfo.formSubmitAllow = true;
        this.dataModelResult = ret;
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
  onActionSelectorSelect(model: CoreGuideModel): void {
    this.dataModel.linkParentId = null;
    if (model && model.id > 0) {
      this.dataModel.linkParentId = model.id;
    }
  }
  onActionFileSelectedlinkFilePodcastIdEn(model: NodeInterface): void {
    this.dataModel.linkFilePodcastIdEn = model.id;
    this.dataModel.linkFilePodcastIdEnSrc = model.downloadLinksrc;
  }
  onActionFileSelectedlinkFileMovieIdEn(model: NodeInterface): void {
    this.dataModel.linkFileMovieIdEn = model.id;
    this.dataModel.linkFileMovieIdEnSrc = model.downloadLinksrc;
  }
  onActionFileSelectedlinkFilePodcastIdFa(model: NodeInterface): void {
    this.dataModel.linkFilePodcastIdFa = model.id;
    this.dataModel.linkFilePodcastIdFaSrc = model.downloadLinksrc;
  }
  onActionFileSelectedlinkFileMovieIdFa(model: NodeInterface): void {
    this.dataModel.linkFileMovieIdFa = model.id;
    this.dataModel.linkFileMovieIdFaSrc = model.downloadLinksrc;
  }
  onActionFileSelectedlinkFilePodcastIdAr(model: NodeInterface): void {
    this.dataModel.linkFilePodcastIdAr = model.id;
    this.dataModel.linkFilePodcastIdArSrc = model.downloadLinksrc;
  }
  onActionFileSelectedlinkFileMovieIdAr(model: NodeInterface): void {
    this.dataModel.linkFileMovieIdAr = model.id;
    this.dataModel.linkFileMovieIdArSrc = model.downloadLinksrc;
  }
  onActionFileSelectedlinkFilePodcastIdDe(model: NodeInterface): void {
    this.dataModel.linkFilePodcastIdDe = model.id;
    this.dataModel.linkFilePodcastIdDeSrc = model.downloadLinksrc;
  }
  onActionFileSelectedlinkFileMovieIdDe(model: NodeInterface): void {
    this.dataModel.linkFileMovieIdDe = model.id;
    this.dataModel.linkFileMovieIdDeSrc = model.downloadLinksrc;
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;

    this.DataAddContent();


  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
}
