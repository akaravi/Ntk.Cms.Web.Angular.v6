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
  EstateAccountUserModel,
  EstateAccountUserService,
  NtkCmsApiStoreService,
} from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EstateAccountUserEditComponent } from '../edit/edit.component';
import { EstateAccountUserAddComponent } from '../add/add.component';
import { CmsConfirmationDialogService } from 'src/app/shared/cms-confirmation-dialog/cmsConfirmationDialog.service';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-estate-accountuser-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
})
export class EstateAccountUserTreeComponent implements OnInit, OnDestroy {
  constructor(
    private cmsToastrService: CmsToastrService,
    public coreEnumService: CoreEnumService,
    public categoryService: EstateAccountUserService,
    private cmsConfirmationDialogService: CmsConfirmationDialogService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private tokenHelper: TokenHelper,
  ) {
    this.loading.cdr = this.cdr;
  }
  @Input() set optionSelectForce(x: number | EstateAccountUserModel) {
    this.onActionSelectForce(x);
  }
  dataModelSelect: EstateAccountUserModel = new EstateAccountUserModel();
  dataModelResult: ErrorExceptionResult<EstateAccountUserModel> = new ErrorExceptionResult<EstateAccountUserModel>();
  filteModel = new FilterModel();
  @Input()  loading = new ProgressSpinnerModel();
  treeControl = new NestedTreeControl<EstateAccountUserModel>(node => null);
  dataSource = new MatTreeNestedDataSource<EstateAccountUserModel>();
  @Output() optionChange = new EventEmitter<EstateAccountUserModel>();
  cmsApiStoreSubscribe: Subscription;
  @Input() optionReload = () => this.onActionReload();

  hasChild = (_: number, node: EstateAccountUserModel) => false;


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

    this.categoryService.ServiceGetAll(this.filteModel).subscribe(
      (next) => {
        if (next.IsSuccess) {
          this.dataModelResult = next;
          this.dataSource.data = this.dataModelResult.ListItems;
        }
        this.loading.Stop(pName);

      },
      (error) => {
        this.cmsToastrService.typeError(error);
        this.loading.Stop(pName);

      }
    );
  }
  onActionSelect(model: EstateAccountUserModel): void {
    this.dataModelSelect = model;
    this.optionChange.emit(this.dataModelSelect);
  }
  onActionReload(): void {
    if (this.dataModelSelect && this.dataModelSelect.Id && this.dataModelSelect.Id.length > 0) {
      this.onActionSelect(this.dataModelSelect);
    }
    else {
      this.onActionSelect(null);
    }
    this.dataModelSelect = new EstateAccountUserModel();
    this.DataGetAll();
  }
  onActionSelectForce(id: number | EstateAccountUserModel): void {

  }

  onActionAdd(): void {
    const dialogRef = this.dialog.open(EstateAccountUserAddComponent, {
      height: '90%',
      data: {}
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
    const dialogRef = this.dialog.open(EstateAccountUserEditComponent, {
      height: '90%',
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

    const title = this.translate.instant('MESSAGE.Please_Confirm');
    const message = 'آیا مایل به حدف این محتوا می باشید ' + '?' + '<br> ( ' + this.dataModelSelect.Title + ' ) ';
    this.cmsConfirmationDialogService.confirm(title, message)
      .then((confirmed) => {
        if (confirmed) {
          const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

          this.categoryService.ServiceDelete(this.dataModelSelect.Id).subscribe(
            (next) => {
              if (next.IsSuccess) {
                this.cmsToastrService.typeSuccessRemove();
                this.DataGetAll();
              } else {
                this.cmsToastrService.typeErrorRemove();
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
      )
      .catch(() => {
        // console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)')
      }
      );
  }
}
