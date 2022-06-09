import {
  ErrorExceptionResult,
  BlogCategoryModel,
  BankPaymentPrivateSiteConfigService,
  BankPaymentPrivateSiteConfigModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { NodeInterface } from 'src/filemanager-api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cms-bankpayment-grid',
  templateUrl: './cms-bankpayment-grid.component.html',
  styleUrls: ['./cms-bankpayment-grid.component.scss'],
})
export class CmsBankpaymentGridComponent implements OnInit {
  constructor(
    public bankPaymentPrivateSiteConfigService: BankPaymentPrivateSiteConfigService,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
  ) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  @Input() optionMasterItem = false;

  @Output() optionChange = new EventEmitter<BankPaymentPrivateSiteConfigModel>();
  dataModelSelect: BankPaymentPrivateSiteConfigModel = new BankPaymentPrivateSiteConfigModel();

  @Input() loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<BankPaymentPrivateSiteConfigModel> = new ErrorExceptionResult<BankPaymentPrivateSiteConfigModel>();
  dataModel: BlogCategoryModel = new BlogCategoryModel();


  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.linkMainImageId = model.id;
    this.dataModel.linkMainImageIdSrc = model.downloadLinksrc;

  }

  ngOnInit(): void {
    this.DataGetAll();
  }
  DataGetAll(): void {
    if (this.optionMasterItem) {
      const pName = this.constructor.name + 'main';
      this.loading.Start(pName);
      this.bankPaymentPrivateSiteConfigService.ServicePaymentGatewayCoreList().subscribe(
        (next) => {
          if (next.isSuccess) {
            this.dataModelResult = next;
            if (this.dataModelResult.listItems && this.dataModelResult.listItems.length == 1) {
              this.onActionSelect(this.dataModelResult.listItems[0]);
            }
          }
          else {
            this.cmsToastrService.typeErrorMessage(next.errorMessage);
          }
          this.loading.Stop(pName);

        },
        (error) => {
          this.cmsToastrService.typeError(error);

          this.loading.Stop(pName);

        }
      );
    }
    else {
      const pName = this.constructor.name + 'main';
      this.loading.Start(pName);
      this.bankPaymentPrivateSiteConfigService.ServicePaymentGatewayList().subscribe(
        (next) => {
          if (next.isSuccess) {
            this.dataModelResult = next;
          }
          else {
            this.cmsToastrService.typeErrorMessage(next.errorMessage);
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

  onActionSelect(model: BankPaymentPrivateSiteConfigModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }

}
