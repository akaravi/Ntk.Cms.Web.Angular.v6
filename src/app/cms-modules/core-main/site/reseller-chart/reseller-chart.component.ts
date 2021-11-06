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
  CoreSiteService,
  RessellerChartModel,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-core-reseller-chart',
  templateUrl: './reseller-chart.component.html',
  styleUrls: ['./reseller-chart.component.scss'],
})
export class CoreSiteResellerChartComponent implements OnInit, OnDestroy {
  requestLinkSiteId = 0;
  constructor(
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: CoreSiteService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
  ) {
    this.loading.cdr = this.cdr;
    this.requestLinkSiteId = + Number(this.activatedRoute.snapshot.paramMap.get('LinkSiteId'));
  }

  dataModelSelect: RessellerChartModel = new RessellerChartModel();
  dataModelResult: ErrorExceptionResult<RessellerChartModel> = new ErrorExceptionResult<RessellerChartModel>();
  filteModel = new FilterModel();
  @Input() loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<RessellerChartModel>(node =>  node.SiteChilds );
  
  dataSource = new MatTreeNestedDataSource<RessellerChartModel>();
  @Output() optionSelect = new EventEmitter<RessellerChartModel>();
  cmsApiStoreSubscribe: Subscription;
  @Input() optionReload = () => this.onActionReload();

  // hasChild = (_: number, node: RessellerChartModel) => false;
  hasChild(_: number, node: RessellerChartModel): boolean {
    if (node && node.SiteChilds && node.SiteChilds.length > 0) {
      return true;
    }
    // if (node && node.UserChilds && node.UserChilds.length > 0) {
    //   return true;
    // }
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

    this.categoryService.ServiceGetRessellerChart(this.requestLinkSiteId).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResult = next;
          this.dataSource.data = [this.dataModelResult.Item];
        }
        this.loading.Stop(pName);

      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);

      }
    );
  }
  onActionSelect(model: RessellerChartModel): void {
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);
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
