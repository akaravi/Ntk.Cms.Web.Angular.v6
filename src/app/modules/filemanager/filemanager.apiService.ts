import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ReturnStatement } from '@angular/compiler';
import { FilemanagerConfig } from './filemanager.config'
import { HttpClient } from 'selenium-webdriver/http';
import { FileCategoryModel, FileContentModel, FileContentService, FilterDataModel, FilterModel } from 'ntk-cms-api';


@Injectable()
export class FileManagerApiService {
  private _config = FilemanagerConfig.getConfig();

  constructor(
    private fileContentService: FileContentService,
  ) { }


  getUrl(methodName: string,) {
    return `${this._config.apBaseiUrl}${methodName}?rootpath=${this._config.rootPath}`;
  }

  getList(path: string) {

    const folderId = +path | 0;


    const filterModel = new FilterModel();
    filterModel.RowPerPage = 100;
    filterModel.SortColumn = 'Title';
    filterModel.Filters = [];
    const filter = new FilterDataModel();
    filter.PropertyName = 'LinkParentId';
    if (folderId > 0) {
      filter.Value = folderId;
    }
    filterModel.Filters.push(filter);

   return this.fileContentService.ServiceGetAll(filterModel);//.map(x => x.ListItems);
    // return this.http.post(this.getUrl(this._config.listAction), { "path": path }).map(x => x.json());
    // return this.http.post(this.getUrl('/list'), { "path": path }).map(x => {
    //   return x.json();
    // });

  };

  copyFromTo(fromPath: string, toPath: string, isMove: boolean) {
    return {};//this.http.post(this.getUrl('/copy'), { 'fromPath': fromPath, 'toPath': toPath, 'isMove': isMove });
  };

  compress(items: string[], compressedFileName: string) {
    return {};//this.http.post(this.getUrl('/compress'), { 'items': items, 'outFile': compressedFileName });
  }

  download(items: string[]) {
    return {};//this.http.post(this.getUrl('/download'), { 'items': items });
  }

  delete(items: string[]) {
    return {};//this.http.post(this.getUrl('/delete'), { 'items': items }).map(x => x.json());;
  }

  rename(path: string, newName: string) {
    debugger
    return {};//this.http.post(this.getUrl('/rename'), { item: path, newItemPath: newName }).map(x => x.json());
  }





}
