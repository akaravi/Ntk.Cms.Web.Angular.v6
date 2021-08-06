import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccessModel, WebDesignerMainIntroModel,
  WebDesignerMainIntroService,
  CoreEnumService,
  DataFieldInfoModel,
  EnumModel,
  ErrorExceptionResult,
  FormInfoModel,
} from 'ntk-cms-api';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { NodeInterface, TreeModel } from 'ntk-cms-filemanager';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-aplication-app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class WebDesignerMainIntroAddComponent implements OnInit {
  requestLinkPageId = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private cmsStoreService: CmsStoreService,
    public publicHelper: PublicHelper,
    public coreEnumService: CoreEnumService,
    private webDesignerMainIntroService: WebDesignerMainIntroService,
    private cmsToastrService: CmsToastrService,
    private router: Router,
    private translate: TranslateService,) {
    this.fileManagerTree = this.publicHelper.GetfileManagerTreeConfig();
  }

  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  loading = new ProgressSpinnerModel();
  formInfo: FormInfoModel = new FormInfoModel();
  dataAccessModel: AccessModel;
  dataModel = new WebDesignerMainIntroModel();
  dataModelResult: ErrorExceptionResult<WebDesignerMainIntroModel> = new ErrorExceptionResult<WebDesignerMainIntroModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  dataModelEnumOsTypeResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();
  selectFileTypeMainImage = ['jpg', 'jpeg', 'png'];
  selectFileTypeMainVideo = ['mp4'];
  fileManagerOpenForm = false;
  fileManagerOpenFormVideo = false;
  appLanguage = 'fa';

  fileManagerTree: TreeModel;
  

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.paramMap.get('LinkPageId')) {
      this.requestLinkPageId = this.activatedRoute.snapshot.paramMap.get('LinkPageId');
    }
    if (this.requestLinkPageId.length > 0) {
      this.dataModel.LinkPageId = this.requestLinkPageId;
    }
    this.DataGetAccess();
    this.getEnumRecordStatus();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult=await this.publicHelper.getEnumRecordStatus();
  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      this.cmsToastrService.typeErrorFormInvalid();
      return;
    }
    this.DataAddContent();
  }

  DataGetAccess(): void {
    this.webDesignerMainIntroService
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
    this.loading.Start('main');
    this.cdr.detectChanges();

    this.webDesignerMainIntroService
      .ServiceAdd(this.dataModel)
      .subscribe(
        async (next) => {
          this.loading.Stop('main');
    this.cdr.detectChanges();
          this.formInfo.FormSubmitAllow = !next.IsSuccess;
          this.dataModelResult = next;
          if (next.IsSuccess) {
            this.formInfo.FormAlert =this.translate.instant('MESSAGE.registration_completed_successfully');
            this.cmsToastrService.typeSuccessEdit();
            setTimeout(() => this.router.navigate(['/webdesigner/intro/']), 100);
          } else {
            this.cmsToastrService.typeErrorEdit(next.ErrorMessage);
          }
        },
        (error) => {
          this.loading.Stop('main');
    this.cdr.detectChanges();
          this.formInfo.FormSubmitAllow = true;
          this.cmsToastrService.typeErrorEdit(error);
        }
      );
  }

  onStepClick(event: StepperSelectionEvent, stepper: MatStepper): void {
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
    this.router.navigate(['/webdesigner/intro/']);
  }
  onActionFileSelectedLinkMainImageId(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;
  }
  onActionFileSelectedLinkMainVideoId(model: NodeInterface): void {
    this.dataModel.LinkMainVideoId = model.id;
    this.dataModel.LinkMainVideoIdSrc = model.downloadLinksrc;
  }

}
