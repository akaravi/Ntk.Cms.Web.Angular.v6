import {
  EnumInfoModel,
  ErrorExceptionResult,
  EstatePropertyTypeLanduseModel,
  EstatePropertyTypeLanduseService,
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
import { CmsLinkToComponent } from 'src/app/shared/cms-link-to/cms-link-to.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-estate-property-type-landuse-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class EstatePropertyTypeLanduseHeaderComponent implements OnInit {
  constructor(
    private headerService: EstatePropertyTypeLanduseService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    private cmsToastrService: CmsToastrService,
    public dialog: MatDialog
  ) {
    this.loading.cdr = this.cdr;
  }
  @Input() optionId = '';
  loading = new ProgressSpinnerModel();
  dataModelResult: ErrorExceptionResult<EstatePropertyTypeLanduseModel> = new ErrorExceptionResult<EstatePropertyTypeLanduseModel>();
  fieldsInfo: Map<string, DataFieldInfoModel> = new Map<string, DataFieldInfoModel>();

  dataModelEnumRecordStatusResult: ErrorExceptionResult<EnumInfoModel> = new ErrorExceptionResult<EnumInfoModel>();


  ngOnInit(): void {
    if (this.optionId?.length > 0) {
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

    this.headerService.setAccessLoad();
    this.headerService.ServiceGetOneById(this.optionId).subscribe(
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
