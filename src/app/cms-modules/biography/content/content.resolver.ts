import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ErrorExceptionResult, FilterModel, NewsContentModel, NewsContentService } from 'ntk-cms-api';
import { Observable } from 'rxjs';
@Injectable()
export class ContentResolver implements Resolve<ErrorExceptionResult<NewsContentModel>>{
  filterModelContent = new FilterModel();
  constructor(private newsContentService: NewsContentService) { }
  resolve(): Observable<ErrorExceptionResult<NewsContentModel>> {
    return this.newsContentService.ServiceGetAll(this.filterModelContent);
  }
}