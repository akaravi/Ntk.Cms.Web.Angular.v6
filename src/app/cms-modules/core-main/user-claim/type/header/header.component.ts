import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  CoreUserClaimTypeService,
  CoreUserClaimTypeModel,
  DataFieldInfoModel,
} from 'ntk-cms-api';
import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { CmsStoreService } from 'src/app/core/reducers/cmsStore.service';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';

@Component({
  selector: 'app-core-userclaimtype-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class CoreUserClaimTypeHeaderComponent implements OnInit {
  constructor(
    private cmsStoreService: CmsStoreService,
    public coreEnumService: CoreEnumService,
    public coreUserClaimTypeService: CoreUserClaimTypeService,
    public publicHelper: PublicHelper,
    private cmsToastrService: CmsToastrService,
  ) {

  }
  @Input() optionId = 0;
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<CoreUserClaimTypeModel> = new ErrorExceptionResult<CoreUserClaimTypeModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();

  

  ngOnInit(): void {
    if (this.optionId > 0) {
      this.DataGetOneContent();
    }
    this.getEnumRecordStatus();
  }
  async getEnumRecordStatus(): Promise<void> {
    this.dataModelEnumRecordStatusResult=await this.publicHelper.getEnumRecordStatus();
  }
  DataGetOneContent(): void {
    this.loading.Start('main');
    this.cdr.detectChanges();
    this.coreUserClaimTypeService.setAccessLoad();
    this.coreUserClaimTypeService.ServiceGetOneById(this.optionId).subscribe(
      (next) => {
        this.fieldsInfo = this.publicHelper.fieldInfoConvertor(next.Access);
        if (next.IsSuccess) {
          this.dataModelResult = next;
        } else {
          this.cmsToastrService.typeErrorMessage(next.ErrorMessage);
        }
        this.loading.Stop('main');
    this.cdr.detectChanges();
      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop('main');
    this.cdr.detectChanges();
      }
    );
  }
}
