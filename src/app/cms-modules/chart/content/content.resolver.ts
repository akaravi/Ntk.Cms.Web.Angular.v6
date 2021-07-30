import { Injectable } from '@angular/core';
import {Resolve} from '@angular/router';
import {Observable} from 'rxjs';
import {ErrorExceptionResult, FilterModel, ChartContentModel, ChartContentService} from 'ntk-cms-api';

@Injectable()
export class ContentResolver implements Resolve<ErrorExceptionResult<ChartContentModel>>{

  filterModelContent = new FilterModel();
  constructor(private contentService: ChartContentService) { }

  resolve(): Observable<ErrorExceptionResult<ChartContentModel>> {
    return this.contentService.ServiceGetAll(this.filterModelContent);
  }
}
