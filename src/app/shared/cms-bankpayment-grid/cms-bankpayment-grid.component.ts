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
import { NodeInterface } from 'projects/ntk-cms-filemanager/src/public-api';

@Component({
  selector: 'app-cms-bankpayment-grid',
  templateUrl: './cms-bankpayment-grid.component.html',
  styleUrls: ['./cms-bankpayment-grid.component.scss'],
})
export class CmsBankpaymentGridComponent implements OnInit {
  constructor(
    public bankPaymentPrivateSiteConfigService: BankPaymentPrivateSiteConfigService,
    private cmsToastrService: CmsToastrService,
    private cdr: ChangeDetectorRef,
    public publicHelper: PublicHelper,
  ) {
    this.loading.cdr = this.cdr;
  }
  @Input() optionMasterItem = false;

  @Output() optionSelect = new EventEmitter<BankPaymentPrivateSiteConfigModel>();
  dataModelSelect: BankPaymentPrivateSiteConfigModel = new BankPaymentPrivateSiteConfigModel();

  @Input() loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<BankPaymentPrivateSiteConfigModel> = new ErrorExceptionResult<BankPaymentPrivateSiteConfigModel>();
  dataModel: BlogCategoryModel = new BlogCategoryModel();


  onActionFileSelected(model: NodeInterface): void {
    this.dataModel.LinkMainImageId = model.id;
    this.dataModel.LinkMainImageIdSrc = model.downloadLinksrc;

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
          if (next.IsSuccess) {
            this.dataModelResult = next;
          }
          else {
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
    else {
      const pName = this.constructor.name + 'main';
      this.loading.Start(pName);
      this.bankPaymentPrivateSiteConfigService.ServicePaymentGatewayList().subscribe(
        (next) => {
          if (next.IsSuccess) {
            this.dataModelResult = next;
          }
          else {
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

  onActionSelect(model: BankPaymentPrivateSiteConfigModel): void {
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);
  }

}
