import { Injectable } from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {ErrorExceptionResult, FilterModel, NewsContentModel, NewsContentService} from 'ntk-cms-api';

@Injectable()
export class ContentResolver implements Resolve<ErrorExceptionResult<NewsContentModel>>{

  filterModelContent = new FilterModel();
  constructor(private contentService: NewsContentService) { }

  resolve(): Observable<ErrorExceptionResult<NewsContentModel>> {
    return this.contentService.ServiceGetAll(this.filterModelContent);
  }
}
