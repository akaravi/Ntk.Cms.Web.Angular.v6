import { Component, OnInit, Input } from '@angular/core';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

@Component({
  selector: 'app-cms-html-widget',
  templateUrl: './cms-html-widget.component.html',
})
export class CmsHtmlWidgetComponent implements OnInit {
  @Input()
  public set optionLoading(v: ProgressSpinnerModel) {
    this.loading = v;
  }
  @Input()
  loading = new ProgressSpinnerModel();
  constructor() { }
  ngOnInit(): void {

  }
  /*
  <app-cms-html-widget [optionLoading]="loading">
    <ng-container cms-header>
      <!--begin:::::::::::::::::::::::::::::::::::::::::cms-header-->
      --------------------------------------
      <!--end:::::::::::::::::::::::::::::::::::::::::cms-header-->
    </ng-container>
    <ng-container cms-body>
      <!--begin:::::::::::::::::::::::::::::::::::::::::cms-body-->
      --------------------------------------
      <!--end:::::::::::::::::::::::::::::::::::::::::cms-body-->
    </ng-container>
    <ng-container cms-footer>
      <!--begin:::::::::::::::::::::::::::::::::::::::::cms-footer-->
      --------------------------------------
      <!--end:::::::::::::::::::::::::::::::::::::::::cms-footer-->
    </ng-container>
  </app-cms-html-widget>
*/
}

