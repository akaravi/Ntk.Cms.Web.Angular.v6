import {
  CoreEnumService,
  EnumModel,
  ErrorExceptionResult,
  WebDesignerMainPageService,
  WebDesignerMainPageModel,
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
  selector: 'app-webdesigner-page-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class WebDesignerMainPageHeaderComponent implements OnInit {
  constructor(
    public coreEnumService: CoreEnumService,
    public webDesignerMainPageService: WebDesignerMainPageService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private cmsToastrService: CmsToastrService,
  ) {

  }
  @Input() optionId = '';
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<WebDesignerMainPageModel> = new ErrorExceptionResult<WebDesignerMainPageModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumModel> = new ErrorExceptionResult<EnumModel>();



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
    this.loading.Start('main');
    this.cdr.detectChanges();
    this.webDesignerMainPageService.setAccessLoad();
    this.webDesignerMainPageService.ServiceGetOneById(this.optionId).subscribe(
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
