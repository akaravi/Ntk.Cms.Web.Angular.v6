import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessModel,
  TicketingTaskModel,
  TicketingTaskService,
  CoreEnumService,
  DataFieldInfoModel,
  EnumInfoModel,
  ErrorExceptionResult,
  FormInfoModel,
  ApplicationSourceModel,
  TicketingTaskDtoModel,
  CoreAuthService,
  CaptchaModel,
  EnumFormSubmitedStatus,
  TokenInfoModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TreeModel } from 'src/filemanager-api';
import { TranslateService } from '@ngx-translate/core';
import { PoinModel } from 'src/app/core/models/pointModel';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ticketing-task-contactus',
  templateUrl: './contact-us-add.component.html',
  styleUrls: ['./contact-us-add.component.scss']
})
export class TicketingTaskContactUsAddComponent implements OnInit {
  requestLinkDepartemenId = 0;
  constructor(
    private tokenHelper: TokenHelper,
    private activatedRoute: ActivatedRoute,
    private coreAuthService: CoreAuthService,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private ticketingTaskService: TicketingTaskService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
    this.tokenHelper.getCurrentToken().then((value) => {
      this.tokenInfo = value;
      this.dataModel.FullName = this.tokenInfo.FullName;
      this.dataModel.Email = this.tokenInfo.Email;
      this.dataModel.PhoneNo = this.tokenInfo.Mobile;
    });
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.tokenInfo = next;
      this.dataModel.FullName = this.tokenInfo.FullName;
      this.dataModel.Email = this.tokenInfo.Email;
      this.dataModel.PhoneNo = this.tokenInfo.Mobile;
    });
  }
  cmsApiStoreSubscribe: Subscription;
  tokenInfo: TokenInfoModel;


  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  dataModel = new TicketingTaskDtoModel();
  dataModelResult: ErrorExceptionResult<TicketingTaskModel> = new ErrorExceptionResult<TicketingTaskModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  dataModelEnumOsTypeResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  fileManagerOpenForm = false;
  appLanguage = 'fa';

  fileManagerTree: TreeModel;
  mapMarker: any;
  mapOptonCenter = new PoinModel();
  captchaModel: CaptchaModel = new CaptchaModel();
  expireDate: string;
  aoutoCaptchaOrder = 1;
  enumFormSubmitedStatus = EnumFormSubmitedStatus;
  onCaptchaOrderInProcess = false;
  ngOnInit(): void {
    this.requestLinkDepartemenId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkDepartemenId'));
    this.onCaptchaOrder();

    this.dataModel.LinkTicketingDepartemenId = this.requestLinkDepartemenId;
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
    this.ticketingTaskService
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

    this.dataModel.CaptchaKey = this.captchaModel.Key;
    this.ticketingTaskService
      .ServiceContactUS(this.dataModel)
      .subscribe(
        async (next) => {

          this.formInfo.FormSubmitAllow = !next.IsSuccess;
          this.dataModelResult = next;
          if (next.IsSuccess) {
            this.formInfo.FormSubmitedStatus = EnumFormSubmitedStatus.Success;
            this.formInfo.FormAlert = this.translate.instant('MESSAGE.registration_completed_successfully');
            this.cmsToastrService.typeSuccessAdd();
          } else {
            this.formInfo.FormSubmitedStatus = EnumFormSubmitedStatus.Error;
            this.cmsToastrService.typeErrorAdd(next.ErrorMessage);
          }
          this.loading.Stop(pName);
          this.cdr.markForCheck();


        },
        (error) => {
          this.loading.Stop(pName);

          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorAdd(error);
          this.cdr.markForCheck();
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
    this.router.navigate(['/application/app/']);
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

  onCaptchaOrder(): void {
    if (this.onCaptchaOrderInProcess) {
      return;
    }
    this.dataModel.CaptchaText = '';
    this.coreAuthService.ServiceCaptcha().subscribe(
      (next) => {

        this.captchaModel = next.Item;
        this.expireDate = next.Item.Expire.split('+')[1];
        const startDate = new Date();
        const endDate = new Date(next.Item.Expire);
        const seconds = (endDate.getTime() - startDate.getTime());
        if (this.aoutoCaptchaOrder < 10) {
          this.aoutoCaptchaOrder = this.aoutoCaptchaOrder + 1;
          setTimeout(() => { this.onCaptchaOrder(); }, seconds);
        }
        if (!next.IsSuccess) {
          this.cmsToastrService.typeErrorGetCpatcha(next.ErrorMessage);
        }
        this.onCaptchaOrderInProcess = false;
      }
      , (error) => {
        this.onCaptchaOrderInProcess = false;
      }
    );
  }

}
