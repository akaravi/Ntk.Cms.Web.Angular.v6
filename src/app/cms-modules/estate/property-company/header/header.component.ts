
import {
  EnumInfoModel,
  ErrorExceptionResult,
  EstatePropertyCompanyModel,
  EstatePropertyCompanyService,
  DataFieldInfoModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { CmsLinkToComponent } from 'src/app/shared/cms-link-to/cms-link-to.component';
import { MatDialog } from '@angular/material/dialog';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-estate-property-company-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class EstatePropertyCompanyHeaderComponent implements OnInit, OnDestroy {
  constructor(
    private headerService: EstatePropertyCompanyService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    private cmsToastrService: CmsToastrService,
    public dialog: MatDialog,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  @Input() optionId = '';
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<EstatePropertyCompanyModel> = new ErrorExceptionResult<EstatePropertyCompanyModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();

  cmsApiStoreSubscribe: Subscription;
  ngOnInit(): void {
    if (this.optionId.length > 0) {
      this.DataGetOneContent();
      this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
        this.DataGetOneContent();
      });
    }

    this.getEnumRecordStatus();
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult = await this.publicHelper.getEnumRecordStatus();
  }
  DataGetOneContent(): void {
    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.headerService.setAccessLoad();
    this.headerService.ServiceGetOneById(this.optionId).subscribe({
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
