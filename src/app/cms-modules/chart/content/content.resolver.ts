import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ChartContentModel, ChartContentService, ErrorExceptionResult, FilterModel } from 'ntk-cms-api';
import { Observable } from 'rxjs';
@Injectable()
export class ContentResolver implements Resolve<ErrorExceptionResult<ChartContentModel>>{
  filterModelContent = new FilterModel();
  constructor(public contentService: ChartContentService) { }
  resolve(): Observable<ErrorExceptionResult<ChartContentModel>> {
    return this.contentService.ServiceGetAll(this.filterModelContent);
  }
}
