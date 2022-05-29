//**msh */
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import {
  MatTreeNestedDataSource,
} from '@angular/material/tree';
import {
  CoreEnumService,
  ErrorExceptionResult,
  FilterModel,
  CoreUserService,
  RessellerChartModel,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-core-user-reseller-chart',
  templateUrl: './reseller-chart.component.html',
  styleUrls: ['./reseller-chart.component.scss'],
})
export class CoreUserResellerChartComponent implements OnInit, OnDestroy {
  requestLinkUserId = 0;
  constructor(
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: CoreUserService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr;
    this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
    this.requestLinkUserId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkUserId'));

  }

  dataModelSelect: RessellerChartModel = new RessellerChartModel();
  dataModelResult: ErrorExceptionResult<RessellerChartModel> = new ErrorExceptionResult<RessellerChartModel>();
  filteModel = new FilterModel();
  @Input() loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<RessellerChartModel>(node => node.UserChilds);

  dataSource = new MatTreeNestedDataSource<RessellerChartModel>();
  @Output() optionChange = new EventEmitter<RessellerChartModel>();
  cmsApiStoreSubscribe: Subscription;
  @Input() optionReload = () => this.onActionReload();

  // hasChild = (_: number, node: RessellerChartModel) => false;
  hasChild(_: number, node: RessellerChartModel): boolean {
    // if (node && node.SiteChilds && node.SiteChilds.length > 0) {
    //   return true;
    // }
    if (node && node.UserChilds && node.UserChilds.length > 0) {
      return true;
    }
    return false;
  }

  ngOnInit(): void {
    this.DataGetAll();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((value) => {
      this.DataGetAll();
    });
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.filteModel.RowPerPage = 200;
    this.filteModel.AccessLoad = true;

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.categoryService.ServiceGetRessellerChart(this.requestLinkUserId).subscribe({
      next: (ret) => {
        if (ret.IsSuccess) {
          this.dataModelResult = ret;
          this.dataSource.data = [this.dataModelResult.Item];
        } else {
          this.cmsToastrService.typeErrorMessage(ret.ErrorMessage);
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
  onActionSelect(model: RessellerChartModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionReload(): void {
    if (this.dataModelSelect) {
      this.onActionSelect(this.dataModelSelect);
    }
    else {
      this.onActionSelect(null);
    }
    this.dataModelSelect = new RessellerChartModel();
    this.DataGetAll();
  }


}
