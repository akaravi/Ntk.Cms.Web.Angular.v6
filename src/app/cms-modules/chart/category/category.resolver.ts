import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { ChartCategoryService, FilterModel } from 'ntk-cms-api';
import { Observable } from 'rxjs';

@Injectable()
export class CategoryResolver implements Resolve<any> {

  categoryModel = new FilterModel();

  constructor(public categoryService: ChartCategoryService) {
  }

  resolve(): Observable<any> {
    return this.categoryService.ServiceGetAll(this.categoryModel);
  }
}
