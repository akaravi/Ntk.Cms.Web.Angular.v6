import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';

@Component({
  selector: 'app-cms-html-card',
  templateUrl: './cms-html-card.component.html',
})
export class CmsHtmlCardComponent implements OnInit {
  @Input()
  public set optionLoading(v: ProgressSpinnerModel) {
    this.loading = v;
  }
  loading = new ProgressSpinnerModel();
  constructor() { }
  ngOnInit(): void {

  }
  /*
<form (ngSubmit)="onFormSubmit()" #vform="ngForm">
  <app-cms-html-card [optionLoading]="loading">
    <ng-container cms-header>
      <h3 class="card-label">
  --------------------------------------
      </h3>
    </ng-container>
    <ng-container cms-body>
      -------------------------------------------------------------------
    </ng-container>
    <ng-container cms-footer>
-------------------------------------------------------------------
    </ng-container>
  </app-cms-html-card>
</form>
*/
}
