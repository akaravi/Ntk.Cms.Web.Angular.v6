import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CoreModuleEntityReportFileModel, File360ViewModel } from 'ntk-cms-api';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-cms-file-360-view-list',
  templateUrl: './cms-file-360-view-list.component.html'
})
export class CmsFile360ViewListComponent implements OnInit {
  static nextId = 0;
  id = ++CmsFile360ViewListComponent.nextId;
  constructor(private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
  ) {

  }
  public fileList: File360ViewModel[] = [];
  @Output() dataModelChange: EventEmitter<File360ViewModel[]> = new EventEmitter<File360ViewModel[]>();
  @Input() set dataModel(model: File360ViewModel[]) {
    if (!model) {
      model = [];
    }
    this.fileList = model;
    this.dataModelChange.emit(model);
  }
  get dataModel(): File360ViewModel[] {
    return this.fileList;
  }



  ngOnInit(): void {
  }

  ngOnDestroy(): void {

  }


  onActionFileSelect(model: CoreModuleEntityReportFileModel): void {

  }
  onFormSubmit(): void {

  }
  onFormCancel(): void {
  }
  onOpenPage(): void {

  }
}
