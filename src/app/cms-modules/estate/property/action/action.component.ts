import {
  CoreEnumService,
  FormInfoModel,
  EstateAdsTypeService,
  DataFieldInfoModel,
  EstatePropertyModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-estate-property-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class EstatePropertyActionComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EstatePropertyActionComponent>,
    public coreEnumService: CoreEnumService,
    public estateAdsTypeService: EstateAdsTypeService,
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    public translate: TranslateService,
  ) {
    if (data) {
      this.dataModel = data.model;
    }
  }
  @ViewChild('vform', { static: false }) formGroup: FormGroup;
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  dataModel: EstatePropertyModel = new EstatePropertyModel();
  formInfo: FormInfoModel = new FormInfoModel();
  fileManagerOpenForm = false;

  ngOnInit(): void {
    this.formInfo.formTitle = this.translate.instant('TITLE.Activities');
  }

  onFormSubmit(): void {
    if (!this.formGroup.valid) {
      return;
    }
    this.formInfo.formSubmitAllow = false;
    this.dialogRef.close({
      dialogChangedDate: true,
      model: this.dataModel
    });
  }
  onFormCancel(): void {
    this.dialogRef.close({ dialogChangedDate: false });
  }

}
