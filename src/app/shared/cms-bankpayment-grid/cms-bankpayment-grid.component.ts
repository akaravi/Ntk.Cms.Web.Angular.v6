import {
  ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output
} from '@angular/core';
import {
  BankPaymentPrivateSiteConfigModel, BankPaymentPrivateSiteConfigService, BlogCategoryModel, ErrorExceptionResult
} from 'ntk-cms-api';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

import { TranslateService } from '@ngx-translate/core';
import { NodeInterface } from 'ntk-cms-filemanager';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';

@Component({
  selector: 'app-cms-bankpayment-grid',
  templateUrl: './cms-bankpayment-grid.component.html',
})
export class CmsBankpaymentGridComponent implements OnInit {
  static nextId = 0;
  id = ++CmsBankpaymentGridComponent.nextId;
  constructor(
    public bankPaymentPrivateSiteConfigService: BankPaymentPrivateSiteConfigService,

    public translate: TranslateService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
  ) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  @Input() optionMasterItem = false;
  errorMessage = '';
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
      this.bankPaymentPrivateSiteConfigService.ServicePaymentGatewayCoreList().subscribe({
        next(ret) {
          if (ret.isSuccess) {
            this.dataModelResult = ret;
            if (this.dataModelResult.listItems && this.dataModelResult.listItems.length == 1) {
              this.onActionSelect(this.dataModelResult.listItems[0]);
            }
          }
          else {
            this.errorMessage = ret.errorMessage;
          }
          this.loading.Stop(pName);

        },
        error(er) {
          this.errorMessage = er;

          this.loading.Stop(pName);

        }
      }
      );
    }
    else {
      const pName = this.constructor.name + 'main';
      this.loading.Start(pName);
      this.bankPaymentPrivateSiteConfigService.ServicePaymentGatewayList().subscribe({
        next(ret) {
          if (ret.isSuccess) {
            this.dataModelResult = ret;
            if (!this.dataModelResult.listItems || this.dataModelResult.listItems.length == 0) {
              this.errorMessage = this.translate.instant('MESSAGE.Payment_portal_is_not_active');
            }
          }
          else {
            this.errorMessage = ret.errorMessage;
          }
          this.loading.Stop(pName);
        }, error(er) {
          this.errorMessage = er;
          this.loading.Stop(pName);
        }

      }
      );
    }
  }

  onActionSelect(model: BankPaymentPrivateSiteConfigModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }

}
