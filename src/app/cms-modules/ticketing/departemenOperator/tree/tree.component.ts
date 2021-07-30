import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import {
  MatTreeNestedDataSource,
} from '@angular/material/tree';
import {
  CoreAuthService,
  CoreEnumService,
  ErrorExceptionResult,
  FilterModel,
  TicketingDepartemenOperatorModel,
  TicketingDepartemenOperatorService,
  NtkCmsApiStoreService,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-application-app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class TicketingDepartemenOperatorTreeComponent implements OnInit {
  constructor(
    private cmsApiStore :NtkCmsApiStoreService,
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: TicketingDepartemenOperatorService,
    private router: Router,

  ) {
  }
  dataModelSelect: TicketingDepartemenOperatorModel = new TicketingDepartemenOperatorModel();
  dataModelResult: ErrorExceptionResult<TicketingDepartemenOperatorModel> = new ErrorExceptionResult<TicketingDepartemenOperatorModel>();
  filteModel = new FilterModel();
  loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<TicketingDepartemenOperatorModel>(node => null);
  dataSource = new MatTreeNestedDataSource<TicketingDepartemenOperatorModel>();
  @Output() optionSelect = new EventEmitter<TicketingDepartemenOperatorModel>();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number | TicketingDepartemenOperatorModel) {
    this.onActionSelectForce(x);
  }

  hasChild = (_: number, node: TicketingDepartemenOperatorModel) => false;


  ngOnInit(): void {
    this.DataGetAll();
    this.cmsApiStoreSubscribe =  this.cmsApiStore.getState((state) =>  state.ntkCmsAPiState.tokenInfo).subscribe(() => {
      this.DataGetAll();
    });
  }
  cmsApiStoreSubscribe:Subscription;
  ngOnDestroy() {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  DataGetAll(): void {
    this.filteModel.RowPerPage = 200;
    this.filteModel.AccessLoad = true;
    this.loading.Globally = false;
    this.loading.display = true;
    this.categoryService.ServiceGetAll(this.filteModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResult = next;
          this.dataSource.data = this.dataModelResult.ListItems;
        }
        this.loading.display = false;

      },
      (error) => {
        this.loading.display = false;

        this.cmsToastrService.typeError(error);

      }
    );
  }
  onActionSelect(model: TicketingDepartemenOperatorModel): void {
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);
  }
  onActionReload(): void {
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      this.onActionSelect(this.dataModelSelect);
    }
    else {
      this.onActionSelect(null);
    }
    this.dataModelSelect = new TicketingDepartemenOperatorModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | TicketingDepartemenOperatorModel): void {

  }

  onActionAdd(): void {
    this.router.navigate(['/application/app/add']);

  }

  onActionEdit(): void {
    let id = 0;
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      id = this.dataModelSelect.Id;
    }
    if (id === 0) {
const message = 'دسته بندی انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.router.navigate(['/application/app/edit/', id]);
  }

  onActionDelete(): void {

    let id = 0;
    if (this.dataModelSelect && this.dataModelSelect.Id > 0) {
      id = this.dataModelSelect.Id;
    }
    if (id === 0) {
const message = 'دسته بندی انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    this.router.navigate(['/application/app/delete/', id]);

  }
}
