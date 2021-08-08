import { Injectable } from '@angular/core';
import { FilemanagerConfig } from './filemanager.config';
import { FileCategoryService, FileContentService, FilterDataModel, FilterModel } from 'ntk-cms-api';
import { map } from 'rxjs/operators';
import { FileItem } from './models/fileItem';


@Injectable()
export class FileManagerApiService {
  private _config = FilemanagerConfig.getConfig();

  constructor(
    private fileContentService: FileContentService,
    private fileCategoryService: FileCategoryService,
  ) { }


  getUrl(methodName: string) {
    return `${this._config.apBaseiUrl}${methodName}?rootpath=${this._config.rootPath}`;
  }

  getCategoryList(path: string) {
    const folderId = +path | 0;
    // const filterModel = new FilterModel();
    // filterModel.RowPerPage = 100;
    // filterModel.SortColumn = 'Title';
    // filterModel.Filters = [];
    // const filter = new FilterDataModel();
    // filter.PropertyName = 'LinkParentId';
    // filter.Value = folderId;

    // filterModel.Filters.push(filter);
    return this.fileCategoryService.ServiceGetSubCategoryFromCategory(folderId).pipe(
      map((x) => {
        const retList: FileItem[] = [];

        x.ListItems.forEach(element => {
          const item = new FileItem();
          item.type = 'dir';
          item.id = element.Id + '';
          item.name = element.Title;
          retList.push(item);
        });
        return retList;
      })
    );
    //.map(x => x.ListItems);
    // return this.http.post(this.getUrl(this._config.listAction), { "path": path }).map(x => x.json());
    // return this.http.post(this.getUrl('/list'), { "path": path }).map(x => {
    //   return x.json();
    // });

  }
  getFileList(path: string) {
    const folderId = +path | 0;
    // const filterModel = new FilterModel();
    // filterModel.RowPerPage = 100;
    // filterModel.SortColumn = 'Title';
    // filterModel.Filters = [];
    // const filter = new FilterDataModel();
    // filter.PropertyName = 'LinkParentId';
    // filter.Value = folderId;

    // filterModel.Filters.push(filter);
    return this.fileContentService.ServiceGetFilesInCategoryId(folderId).pipe(
      map((x) => {
        const retList: FileItem[] = [];
        x.ListItems.forEach(element => {
          const item = new FileItem();
          item.type = 'file';
          item.id = element.Id + '';
          item.name = element.FileName;
          item.type = element.Extension;
          retList.push(item);
        });
        return retList;
      })
    );
    //.map(x => x.ListItems);
    // return this.http.post(this.getUrl(this._config.listAction), { "path": path }).map(x => x.json());
    // return this.http.post(this.getUrl('/list'), { "path": path }).map(x => {
    //   return x.json();
    // });

  }

  copyFromTo(fromPath: string, toPath: string, isMove: boolean) {
    return {}; // this.http.post(this.getUrl('/copy'), { 'fromPath': fromPath, 'toPath': toPath, 'isMove': isMove });
  }

  compress(items: string[], compressedFileName: string) {
    return {}; // this.http.post(this.getUrl('/compress'), { 'items': items, 'outFile': compressedFileName });
  }

  download(items: string[]) {
    return {}; // this.http.post(this.getUrl('/download'), { 'items': items });
  }

  delete(items: string[]) {
    return {}; // this.http.post(this.getUrl('/delete'), { 'items': items }).map(x => x.json());;
  }

  rename(path: string, newName: string) {
    return {}; // this.http.post(this.getUrl('/rename'), { item: path, newItemPath: newName }).map(x => x.json());
  }





}
