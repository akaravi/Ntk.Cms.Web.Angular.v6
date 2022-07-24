import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
import {
  AccessModel,
  CoreEnumService,
  CoreModuleModel,
  CoreModuleService,
  CoreSiteModel,
  CoreSiteService,
  DataFieldInfoModel,
  EnumInfoModel,
  ErrorExceptionResult,
  ErrorExceptionResultBase,
  TokenInfoModel,
} from 'ntk-cms-api';
import { ConfigInterface, DownloadModeEnum, TreeModel } from 'src/filemanager-api';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CmsStoreService } from '../reducers/cmsStore.service';
import { CmsToastrService } from '../services/cmsToastr.service';
import { CmsAccessInfoComponent } from 'src/app/shared/cms-access-info/cms-access-info.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// import { ProviderAst } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class PublicHelper {
  constructor(
    private router: Router,
    private cmsToastrService: CmsToastrService,
    public translate: TranslateService,
    private coreEnumService: CoreEnumService,
    private coreSiteService: CoreSiteService,
    private coreModuleService: CoreModuleService,
    private cmsStoreService: CmsStoreService,
    public dialog: MatDialog,
  ) {
    this.fileManagerTreeConfig = new TreeModel(this.treefileConfig);

  }
  appClientVersion = environment.appVersion;
  appServerVersion = '';

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: 'auto',
    minHeight: '50',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'متن را وارد کنید ...',
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
  editorConfigFull: AngularEditorConfig = {
    editable: true,
    spellcheck: false,
    height: 'auto',
    minHeight: '50',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'متن را وارد کنید ...',
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
      [
        'redo',
      ],
      [
        'removeFormat',
      ]
    ]

  };
  treefileConfig: ConfigInterface = {
    baseURL: environment.cmsServerConfig.configApiServerPath,
    baseUploadURL: environment.cmsServerConfig.configFileServerPath,
    api: {
      listFile: 'FileContent/GetAll',
      listFolder: 'FileCategory/GetAll',
      uploadFile: 'upload',
      downloadFile: 'download',
      deleteFile: 'FileContent',
      deleteFolder: 'FileCategory',
      createFolder: 'FileCategory',
      createFile: 'FileContent',
      getOneFile: 'FileContent',
      getOneFolder: 'FileCategory',
      renameFile: 'FileContent',
      renameFolder: 'FileCategory',
      searchFiles: 'FileCategory/GetAll',
    },
    options: {
      title: 'Select File',
      allowFolderDownload: DownloadModeEnum.DOWNLOAD_FILES,
      showFilesInsideTree: false,
      showSelectFile: true,
      showSelectFolder: false,
    }
  };
  fileManagerTreeConfig: TreeModel;
  GetfileManagerTreeConfig(): TreeModel {
    this.fileManagerTreeConfig.config.baseURL = environment.cmsServerConfig.configApiServerPath;
    this.fileManagerTreeConfig.config.baseUploadURL = environment.cmsServerConfig.configFileServerPath;
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
        if (errorExceptionResult.status === 401) {
          this.cmsToastrService.typeErrorMessage(
            this.translate.instant('ERRORMESSAGE.MESSAGE.typePleaseLogInAgaint'),
            this.translate.instant('ERRORMESSAGE.TITLE.typePleaseLogInAgaint')
          );
          this.router.navigate(['/auth/singin']);
          return;
        }
      }
    }
    if (model.errors) {
      return '';
    } else if (model && model.errorMessage) {
      return model.errorMessage;
    }
    return 'Error';
  }
  SplitAllChar(str: string): string[] {
    if (str && str.length > 0) {
      const ret = str.replace(/\n/g, ",").split(",");
      return ret;
    }
    return [];
  }
  LocaleDate(model): string {
    if (model) {
      const d = new Date(model);
      return d.toLocaleDateString('fa-Ir');
    }
    return '';
  }
  getTime(model): string {
    if (model) {
      const d = new Date(model);
      return d.getHours() + ":" + d.getMinutes();
    }
    return '';
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
    if (!dataAccessModel || !dataAccessModel.fieldsInfo || dataAccessModel.fieldsInfo.length === 0) {
      return retOut;
    }
    const field = dataAccessModel.fieldsInfo.find(x => x.fieldName === fieldName);
    if (!field) {
      return retOut;
    }
    return field;
  }
  fieldInfoConvertor(dataAccessModel: AccessModel): Map<string, DataFieldInfoModel> {
    const retOut = new Map<string, DataFieldInfoModel>();
    if (!dataAccessModel || !dataAccessModel.fieldsInfo || dataAccessModel.fieldsInfo.length === 0) {
      return retOut;
    }
    dataAccessModel.fieldsInfo.forEach((el) => retOut[el.fieldName] = el);
    if (environment.checkAccess) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.data = { access: dataAccessModel };
      dialogConfig.height = '70%' ;
      const dialogRef = this.dialog.open(CmsAccessInfoComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.dialogChangedDate) {

        }
      });
    }
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

    return oid;
  }

  async getEnumRecordStatus(): Promise<ErrorExceptionResult<EnumInfoModel>> {
    const storeSnapshot = this.cmsStoreService.getStateSnapshot();
    if (storeSnapshot?.EnumRecordStatusResultStore?.listItems?.length > 0) {
      return storeSnapshot.EnumRecordStatusResultStore;
    }

    return await this.coreEnumService.ServiceEnumRecordStatus()
      .pipe(map(response => {
        this.cmsStoreService.setState({ EnumRecordStatusResultStore: response });
        return response;
      })).toPromise();

  }
  async getCurrentSite(): Promise<ErrorExceptionResult<CoreSiteModel>> {
    const storeSnapshot = this.cmsStoreService.getStateSnapshot();
    if (storeSnapshot?.CoreSiteResultStore) {
      return storeSnapshot.CoreSiteResultStore;
    }
    return await this.coreSiteService.ServiceCurrectSite()
      .pipe(map(response => {
        this.cmsStoreService.setState({ CoreSiteResultStore: response });
        return response;
      })).toPromise();
  }
  async getCurrentSiteModule(): Promise<ErrorExceptionResult<CoreModuleModel>> {
    const storeSnapshot = this.cmsStoreService.getStateSnapshot();
    if (storeSnapshot?.CoreModuleResultStore) {
      return storeSnapshot.CoreModuleResultStore;
    }
    return await this.coreModuleService.ServiceGetAllModuleName(null)
      .pipe(map(response => {
        this.cmsStoreService.setState({ CoreModuleResultStore: response });
        return response;
      })).toPromise();
  }
  StringRandomGenerator(passwordLength = 10, onlynumber = false): string {
    // const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    if (onlynumber === true) {
      chars = '0123456789';
    }

    let password = '';

    for (let i = 0; i <= passwordLength; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    if (onlynumber === true && password.indexOf('0') == 0) {
      password = '1' + password.substring(1);
    }
    return password;
  }
  StringPasswordGenerator(passwordLength = 10): string {
    // const chars = '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    let password = '';

    for (let i = 0; i <= passwordLength; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
  }
  checkIsHTML(text: string): boolean {
    const alphaExp = /<(\"[^\"]*\"|'[^']*'|[^'\">])*>/g;
    return alphaExp.test(text);
  }
  checkModule(moduleName: string): boolean {
    if (environment.cmsServerConfig.modules && environment.cmsServerConfig.modules.length > 0 && environment.cmsServerConfig.modules.findIndex(x => x.toLowerCase() == moduleName.toLowerCase()) < 0)
      return false;
    return true;
  }
  TabledisplayedColumnsCheckByAllDataAccess(cloumn: string[], cloumnCheck: string[], token: TokenInfoModel): string[] {

    if (!cloumnCheck || cloumnCheck.length == 0) {
      cloumnCheck = [];
    }
    if (cloumn.indexOf('Id') >= 0)
      cloumnCheck.push('Id');
    if (cloumn.indexOf('LinkSiteId') >= 0)
      cloumnCheck.push('LinkSiteId');
    if (token.userAccessAdminAllowToAllData || token.userAccessAdminAllowToProfessionalData) {
      var i = 0;
      cloumnCheck.forEach(element => {
        cloumn = this.listAddIfNotExist(cloumn, element, ++i);
      });
    } else {
      cloumnCheck.forEach(element => {
        cloumn = this.listRemoveIfExist(cloumn, element);
      });
    }
    return cloumn;
  }
}
