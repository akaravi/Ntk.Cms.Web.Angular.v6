import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessModel,
  TicketingAnswerModel,
  TicketingAnswerService,
  CoreEnumService,
  DataFieldInfoModel,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  ApplicationSourceModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TreeModel } from 'src/filemanager-api';
import { TranslateService } from '@ngx-translate/core';
import { PoinModel } from 'src/app/core/models/pointModel';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ticketing-answer-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class TicketingAnswerAddComponent implements OnInit {
  requestLinkTaskId = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<TicketingAnswerAddComponent>,
    private activatedRoute: ActivatedRoute,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private ticketingAnswerService: TicketingAnswerService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,

  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    if (data) {
      this.requestLinkTaskId = +data.LinkTaskId || 0;
    }

  }


  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModel = new TicketingAnswerModel();
  dataModelResult: ErrorExceptionResult<TicketingAnswerModel> = new ErrorExceptionResult<TicketingAnswerModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumOsTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerOpenForm = false;
  appLanguage = 'fa';

  fileManagerTree: TreeModel;
  mapMarker: any;
  mapOptonCenter = new PoinModel();

  ngOnInit(): void {
    // this.requestLinkTaskId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkTaskId'));
    if (this.requestLinkTaskId === 0) {
      this.cmsToastrService.typeErrorAddRowParentIsNull();
      return;
    }
    this.dataModel.LinkTaskId = this.requestLinkTaskId;
    this.DataGetAccess();
    this.getEnumRecordStatus();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }
  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }

    this.DataAddContent();
  }

  DataGetAccess(): void {
    this.ticketingAnswerService
      .ServiceViewModel()
      .subscribe(
        async (next) => {
          if (next.IsSuccess) {
            this.dataAccessModel = next.Access;
            this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
          } else {
            this.cmsToastrService.typeErrorGetAccess(next.ErrorMessage);
          }
        },
        (error) => {
          this.cmsToastrService.typeErrorGetAccess(error);
        }
      );
  }

  DataAddContent(): void {
    this.formInfo.FormSubmitAllow = false;
    this.formInfo.FormAlert = this.translate.instant('MESSAGE.sending_information_to_the_server');
    this.formInfo.FormError = '';
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);


    this.ticketingAnswerService.ServiceAdd(this.dataModel).subscribe(async (next) => {
      this.formInfo.FormSubmitAllow = !next.IsSuccess;
      this.dataModelResult = next;
      if (next.IsSuccess) {
        this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
        this.cmsToastrService.typeSuccessAdd();
        setTimeout(() => { this.dialogRef.close({ dialogChangedDate: true }); }, 1000);
      } else {
        this.cmsToastrService.typeErrorAdd(next.ErrorMessage);
      }
      this.loading.Stop(pName);

    },
      (error) => {
        this.loading.Stop(pName);

        this.formInfo.FormSubmitAllow = true;
        this.cmsToastrService.typeErrorAdd(error);
      }
    );
  }

  onStepClick(event: StepperSelectionEvent, stepper: any): void {
    if (event.previouslySelectedIndex < event.selectedIndex) {
      // if (!this.formGroup.valid) {
      //   this.cmsToastrService.typeErrorFormInvalid();
      //   setTimeout(() => {
      //     stepper.selectedIndex = event.previouslySelectedIndex;
      //     // stepper.previous();
      //   }, 10);
      // }
    }
  }

  onActionBackToParent(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }
  onActionFileSelectedLinkMainImageId(): void {
    // this.dataModel.LinkMainImageId = model.id;
    // this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;
  }

  onActionSelectSource(model: ApplicationSourceModel | null): void {
    if (!model || model.Id <= 0) {
      this.cmsToastrService.typeErrorMessage(
        'سورس را مشخص کنید',
        'سورس اپلیکیشن اطلاعات مشخص نیست'
      );
      return;
    }
    this.dataModel.LinkTicketingDepartemenId = model.Id;
  }

}
