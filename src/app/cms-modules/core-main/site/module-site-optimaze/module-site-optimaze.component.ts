import {
  CoreEnumService,
  ErrorExceptionResult,
  FormInfoModel,
  CoreSiteService,
  CoreSiteModel,
  ProcessModuleSiteDataOptimazeOutputModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material/stepper';


@Component({
  selector: 'app-core-site-module-site-optimaze',
  templateUrl: './module-site-optimaze.component.html',
  styleUrls: ['./module-site-optimaze.component.scss'],
})
export class CoreSiteModuleSiteOptimazeComponent implements OnInit {
  requestLinkSiteId=0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CoreSiteModuleSiteOptimazeComponent>,
    public coreEnumService: CoreEnumService,
    public coreSiteService: CoreSiteService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
  ) {
    this.loading.cdr = this.cdr;
    if (data) {
      this.requestLinkSiteId = +data.LinkSiteId || 0;
    }
  }

  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<ProcessModuleSiteDataOptimazeOutputModel> = new ErrorExceptionResult<ProcessModuleSiteDataOptimazeOutputModel>();
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  formInfo: FormInfoModel = new FormInfoModel();

  ngOnInit(): void {
    if (this.requestLinkSiteId <= 0) {
      this.cmsToastrService.typeErrorDeleteRowIsNull();
      this.dialogRef.close({ dialogChangedDate: false });
      return;
    }
    this.formInfo.FormTitle = 'مشاهده نتیجه  ';
    this.DataGetAll();
  }
  DataGetAll(): void {  
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.coreSiteService.ServiceModuleDataOptimaze(this.requestLinkSiteId).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResult = next;   
        }
        this.loading.Stop(pName);
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );
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
}
