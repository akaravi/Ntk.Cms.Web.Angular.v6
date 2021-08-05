import { Component, OnInit, Input } from '@angular/core';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

@Component({
  selector: 'app-cms-html-loading',
  templateUrl: './cms-html-loading.component.html',
})
export class CmsHtmlLoadingComponent implements OnInit {
  @Input()
  public set optionLoading(v: ProgressSpinnerModel) {
    this.loading = v;
  }
  loading = new ProgressSpinnerModel();
  constructor() { }
  ngOnInit(): void {

  }
  /*
  <app-cms-html-loading [optionLoading]="loading">
  </app-cms-html-loading>
*/
}
