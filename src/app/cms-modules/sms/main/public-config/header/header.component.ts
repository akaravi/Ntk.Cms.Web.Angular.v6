//**msh */
import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  SmsMainApiPathPublicConfigService,
  SmsMainApiPathPublicConfigModel,
  DataFieldInfoModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sms-publicconfig-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class SmsMainApiPathPublicConfigHeaderComponent implements OnInit {
  constructor(
    public coreEnumService: CoreEnumService,
    public smsMainApiPathPublicConfigService: SmsMainApiPathPublicConfigService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService,
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  @Input() optionId = '';
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<SmsMainApiPathPublicConfigModel> = new ErrorExceptionResult<SmsMainApiPathPublicConfigModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();



  ngOnInit(): void {
    if (this.optionId.length > 0) {
      this.DataGetOneContent();
    }
    this.getEnumRecordStatus();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }
  DataGetOneContent(): void {
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.smsMainApiPathPublicConfigService.setAccessLoad();
    this.smsMainApiPathPublicConfigService.ServiceGetOneById(this.optionId).subscribe({
      next: (ret) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(ret.access);
        if (ret.isSuccess) {
          this.dataModelResult = ret;
        } else {
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
}
