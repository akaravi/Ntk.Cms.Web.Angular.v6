import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
import { AccessModel, DataFieldInfoModel, ErrorExceptionResultBase } from 'ntk-cms-api';
import { TreeModel } from 'ntk-cms-filemanager';
import { environment } from 'src/environments/environment';
import { CmsToastrService } from '../services/cmsToastr.service';

@Injectable({
  providedIn: 'root',
})
export class PublicHelper {
  constructor(
    private router: Router,
    private cmsToastrService: CmsToastrService,
    private translate: TranslateService,

  ) { }
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '30',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };
  fileManagerTreeConfig: TreeModel = new TreeModel();
  GetfileManagerTreeConfig(): TreeModel {
    this.fileManagerTreeConfig.config.baseURL = environment.cmsServerConfig.configApiServerPath;
    this.fileManagerTreeConfig.config.baseUploadURL = environment.cmsServerConfig.configRouteUploadFileContent;
    return this.fileManagerTreeConfig;
  }
  CheckError(model: any): any {
    if (!model) {
      return 'Error';
    }
    let errorExceptionResult: ErrorExceptionResultBase;
    if (model.error) {
      errorExceptionResult = model.error;
      if (errorExceptionResult) {
        if (errorExceptionResult.Status === 401) {
          this.cmsToastrService.typeErrorMessage(
            this.translate.instant('ERRORMESSAGE.MESSAGE.typePleaseLogInAgaint'),
            this.translate.instant('ERRORMESSAGE.TITLE.typePleaseLogInAgaint')
          );
          this.router.navigate([environment.cmsUiConfig.Pathlogin]);
          return;
        }
      }
    }
    if (model.errors) {
      return '';
    } else if (model && model.ErrorMessage) {
      return model.ErrorMessage;
    }
    return 'Error';
  }

  LocaleDate(model): string {
    const d = new Date(model);
    return d.toLocaleDateString('fa-Ir');
  }

  Truncate(value: string, limit: number = 20, trail: string = '...'): string {
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }

  RecordStatus(model): string {
    return this.RecordStatus[model];
  }

  listAddIfNotExist(listStr: string[], item: string, index: number): string[] {
    if (listStr.indexOf(item) < 0) {
      listStr.splice(index, 0, item);
    }
    return listStr;
  }
  listRemoveIfExist(listStr: string[], item: string): string[] {
    const index = listStr.indexOf(item);
    if (index < 0) {
      return listStr;
    }
    listStr.splice(index, 1);
    return listStr;
  }
  fieldInfo(dataAccessModel: AccessModel, fieldName: string): DataFieldInfoModel {
    const retOut = new DataFieldInfoModel();
    if (!dataAccessModel || !dataAccessModel.FieldsInfo || dataAccessModel.FieldsInfo.length === 0) {
      return retOut;
    }
    const field = dataAccessModel.FieldsInfo.find(x => x.FieldName === fieldName);
    if (!field) {
      return retOut;
    }
    return field;
  }
  fieldInfoConvertor(dataAccessModel: AccessModel): Map<string, DataFieldInfoModel> {
    const retOut = new Map<string, DataFieldInfoModel>();
    if (!dataAccessModel || !dataAccessModel.FieldsInfo || dataAccessModel.FieldsInfo.length === 0) {
      return retOut;
    }
    dataAccessModel.FieldsInfo.forEach((el) => retOut[el.FieldName] = el);
    return retOut;
  }
  RowStyleExpireDate(row: Date): string {
    if (!row) {
      return '';
    }
    const dateTime = new Date();
    if (new Date(row) < dateTime) {
      return '#fc6868';
    }
    dateTime.setMonth(dateTime.getMonth() + 1);
    if (new Date(row) < dateTime) {
      return '#ffc691';
    }
    dateTime.setMonth(dateTime.getMonth() + 2);
    if (new Date(row) < dateTime) {
      return '#ffe291';
    }
    dateTime.setMonth(dateTime.getMonth() + 12);
    if (new Date(row) < dateTime) {
      return '#d7ff91';
    }
    return '#91ffa5';
  }
  generateId(): string {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    const oid = timestamp + 'xxxxxxxxxxxxxxxx'
      .replace(/[x]/g, _ => (Math.random() * 16 | 0).toString(16))
      .toLowerCase();

    return  oid ;
  }
}
