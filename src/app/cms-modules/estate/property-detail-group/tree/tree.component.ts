import {
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
  CoreAuthService,
  CoreEnumService,
  ErrorExceptionResult,
  FilterModel,
  EstatePropertyDetailGroupModel,
  EstatePropertyDetailGroupService,
  NtkCmsApiStoreService,
  FilterDataModel,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EstatePropertyDetailGroupEditComponent } from '../edit/edit.component';
import { EstatePropertyDetailGroupAddComponent } from '../add/add.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';


@Component({
  selector: 'app-estate-detailgroup-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class EstatePropertyDetailGroupTreeComponent implements OnInit, OnDestroy {
  requestLinkPropertyTypeLanduseId = '';
  constructor(
    private cmsApiStore: NtkCmsApiStoreService,
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: EstatePropertyDetailGroupService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    public dialog: MatDialog
  ) {
  }
  @Input() set optionSelectForce(x: number | EstatePropertyDetailGroupModel) {
    this.onActionSelectForce(x);
  }
  dataModelSelect: EstatePropertyDetailGroupModel = new EstatePropertyDetailGroupModel();
  dataModelResult: ErrorExceptionResult<EstatePropertyDetailGroupModel> = new ErrorExceptionResult<EstatePropertyDetailGroupModel>();
  filteModel = new FilterModel();
  loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<EstatePropertyDetailGroupModel>(node => null);
  dataSource = new MatTreeNestedDataSource<EstatePropertyDetailGroupModel>();
  @Output() optionSelect = new EventEmitter<EstatePropertyDetailGroupModel>();
  cmsApiStoreSubscribe: Subscription;

  @Input() set optionLinkPropertyTypeLanduseId(id: string) {
    this.requestLinkPropertyTypeLanduseId = id;
    this.filteModel = new FilterModel();
    if (id && id.length > 0) {
      const filter = new FilterDataModel();
      filter.PropertyName = 'LinkPropertyTypeLanduseId';
      filter.Value = id;
      this.filteModel.Filters.push(filter);
    }
  }
  @Input() optionReload = () => this.onActionReload();
  hasChild = (_: number, node: EstatePropertyDetailGroupModel) => false;


  ngOnInit(): void {
    this.DataGetAll();
    this.cmsApiStoreSubscribe = this.cmsApiStore.getState((state) => state.ntkCmsAPiState.tokenInfo).subscribe(() => {
      this.DataGetAll();
    });
  }
  ngOnDestroy(): void {
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
  onActionSelect(model: EstatePropertyDetailGroupModel): void {
    this.dataModelSelect = model;
    this.optionSelect.emit(this.dataModelSelect);
  }
  onActionReload(): void {
    if (this.dataModelSelect && this.dataModelSelect.Id && this.dataModelSelect.Id.length > 0) {
      this.onActionSelect(this.dataModelSelect);
    }
    else {
      this.onActionSelect(null);
    }
    this.dataModelSelect = new EstatePropertyDetailGroupModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | EstatePropertyDetailGroupModel): void {

  }

  onActionAdd(): void {
    const dialogRef = this.dialog.open(EstatePropertyDetailGroupAddComponent, {
      data: { LinkPropertyTypeLanduseId: this.requestLinkPropertyTypeLanduseId }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionEdit(): void {
    let id = '';
    if (this.dataModelSelect && this.dataModelSelect.Id && this.dataModelSelect.Id.length > 0) {
      id = this.dataModelSelect.Id;
    }
    if (id === '') {
      const message = 'دسته بندی انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message);
      return;
    }
    const dialogRef = this.dialog.open(EstatePropertyDetailGroupEditComponent, {
      data: { id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.dialogChangedDate) {
        this.DataGetAll();
      }
    });
  }

  onActionDelete(): void {

    let id = '';
    if (this.dataModelSelect && this.dataModelSelect.Id && this.dataModelSelect.Id.length > 0) {
      id = this.dataModelSelect.Id;
    }
    if (id === '') {
      const message1 = 'دسته بندی انتخاب نشده است';
      this.cmsToastrService.typeErrorSelected(message1);
      return;
    }

    const title = 'لطفا تایید کنید...';
    const message = 'آیا مایل به حدف این محتوا می باشید ' + '?' + '<br> ( ' + this.dataModelSelect.Title + ' ) ';
    this.cmsConfirmationDialogService.confirm(title, message)
      .then((confirmed) => {
        if (confirmed) {
          this.loading.display = true;
          this.categoryService.ServiceDelete(this.dataModelSelect.Id).subscribe(
            (next) => {
              if (next.IsSuccess) {
                this.cmsToastrService.typeSuccessRemove();
                this.DataGetAll();
              } else {
                this.cmsToastrService.typeErrorRemove();
              }
              this.loading.display = false;
            },
            (error) => {
              this.cmsToastrService.typeError(error);
              this.loading.display = false;
            }
          );
        }
      }
      )
      .catch(() => {
        // console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)')
      }
      );
  }
}
