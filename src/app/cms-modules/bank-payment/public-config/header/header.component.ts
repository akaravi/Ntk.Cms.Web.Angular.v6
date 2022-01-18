import {
  CoreEnumService,
  EnumInfoModel,
  ErrorExceptionResult,
  BankPaymentPublicConfigService,
  BankPaymentPublicConfigModel,
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
@Component({
  selector: 'app-bankpayment-publicconfig-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class BankPaymentPublicConfigHeaderComponent implements OnInit {
  constructor(
    public coreEnumService: CoreEnumService,
    public bankPaymentPublicConfigService: BankPaymentPublicConfigService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private cmsToastrService: CmsToastrService,
  ) {
    this.loading.cdr = this.cdr;
  }
  @Input() optionId = 0;
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<BankPaymentPublicConfigModel> = new ErrorExceptionResult<BankPaymentPublicConfigModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();
  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();
  ngOnInit(): void {
    if (this.optionId > 0) {
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
    this.bankPaymentPublicConfigService.setAccessLoad();
    this.bankPaymentPublicConfigService.ServiceGetOneById(this.optionId).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
        if (next.IsSuccess) {
          this.dataModelResult = next;
        } else {
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop(pName);
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);
      }
    );
  }
}