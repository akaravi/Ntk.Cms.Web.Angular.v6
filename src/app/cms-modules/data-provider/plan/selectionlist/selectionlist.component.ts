//**msh */
import { Component, OnInit, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CoreEnumService, ErrorExceptionResult, FilterModel, DataProviderPlanModel, DataProviderPlanService } from 'ntk-cms-api';
import { FormControl } from '@angular/forms';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { Output } from '@angular/core';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-data-provider-plan-selectionlist',
  templateUrl: './selectionlist.component.html'
})
export class DataProviderPlanSelectionlistComponent implements OnInit {

  constructor(
    public coreEnumService: CoreEnumService,
    public categoryService: DataProviderPlanService,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
    private cmsToastrService: CmsToastrService) {
    this.loading.cdr = this.cdr;this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  dataModelResult: ErrorExceptionResult<DataProviderPlanModel> = new ErrorExceptionResult<DataProviderPlanModel>();
  dataModelSelect: DataProviderPlanModel[] = [];
  dataIdsSelect: number[] = [];
  loading = new ProgressSpinnerModel();
  formControl = new FormControl();
  fieldsStatus: Map<number, boolean> = new Map<number, boolean>();

  @Input() optionDisabled = false;
  @Input() optionSelectFirstItem = false;
  @Input() optionPlaceholder = '';
  @Output() optionChange = new EventEmitter<DataProviderPlanModel[]>();
  @Output() optionSelectAdded = new EventEmitter();
  @Output() optionSelectRemoved = new EventEmitter();
  @Input() optionReload = () => this.onActionReload();
  @Input() set optionSelectForce(x: number[] | DataProviderPlanModel[]) {
    this.onActionSelectForce(x);
    this.onActionReSelect();
  }

  ngOnInit(): void {
    this.DataGetAll();
  }

  DataGetAll(): void {
    const filteModel = new FilterModel();
    filteModel.RowPerPage = 50;
    filteModel.AccessLoad = true;
    // this.loading.backdropEnabled = false;

    // tslint:disable-next-line: no-trailing-whitespace

    const pName = this.constructor.name + 'main';
    this.loading.Start(pName);

    this.categoryService.ServiceGetAll(filteModel).subscribe({
      next: (ret) => {
        // this.fieldsStatus = new Map<number, boolean>();
        if (ret.IsSuccess) {
          this.dataModelResult = ret;
          this.dataModelResult.ListItems.forEach((el) => this.fieldsStatus.set(el.Id, false));
          this.dataIdsSelect.forEach((el) => this.fieldsStatus.set(el, true));
          this.dataModelResult.ListItems.forEach((el) => {
            if (this.fieldsStatus.get(el.Id)) {
              this.dataModelSelect.push(el);
            }
          });

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
  onActionSelect(value: DataProviderPlanModel): void {

    if (this.fieldsStatus.get(value.Id)) {
      this.fieldsStatus.set(value.Id, false);
      this.optionSelectRemoved.emit(value);
      this.dataModelSelect.splice(this.dataModelSelect.indexOf(value), 1);
    } else {
      this.fieldsStatus.set(value.Id, true);
      this.optionSelectAdded.emit(value);
      this.dataModelSelect.push(value);
    }
    this.optionChange.emit(this.dataModelSelect);
  }


  onActionSelectForce(ids: number[] | DataProviderPlanModel[]): void {
    if (typeof ids === typeof Array(Number)) {
      ids.forEach(element => {
        this.dataIdsSelect.push(element);
      });
    } else if (typeof ids === typeof Array(DataProviderPlanModel)) {
      ids.forEach(element => {
        this.dataIdsSelect.push(element.Id);
      });
    }
    this.dataIdsSelect.forEach((el) => this.fieldsStatus.set(el, true));
  }

  onActionReload(): void {
    // this.dataModelSelect = new DataProviderPlanModel();
    this.DataGetAll();
  }
  // It is for AddSelect
  onActionReSelect(): void {
    this.dataModelResult.ListItems.forEach((el) => this.fieldsStatus.set(el.Id, false));
    this.dataIdsSelect.forEach((el) => this.fieldsStatus.set(el, true));
    this.dataModelResult.ListItems.forEach((el) => {
      if (this.fieldsStatus.get(el.Id)) {
        this.dataModelSelect.push(el);
      }
    });
  }
}
