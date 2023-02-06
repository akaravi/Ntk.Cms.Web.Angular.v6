
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EnumTicketStatus, FilterDataModel, FilterModel, TicketingTaskService } from 'ntk-cms-api';
import { Subscription } from 'rxjs';
import { TokenHelper } from 'src/app/core/helpers/tokenHelper';
import { ProgressSpinnerModel } from 'src/app/core/models/progressSpinnerModel';
import { WidgetContentInfoModel, WidgetInfoModel } from 'src/app/core/models/widget-info-model';
@Component({
  selector: 'app-ticketing-task-widget2',
  templateUrl: './widget2.component.html',
  styleUrls: ['./widget2.component.scss']
})
export class TicketingTaskWidget2Component implements OnInit, OnDestroy {
  @Input() cssClass = '';
  @Input() widgetHeight = '200px';
  @Input() baseColor = 'success';
  @Input() iconColor = 'success';
  textInverseCSSClass;
  svgCSSClass;
  constructor(
    private service: TicketingTaskService,
    private cdr: ChangeDetectorRef,
    private tokenHelper: TokenHelper,
    public translate: TranslateService,
  ) {
    this.loading.cdr = this.cdr; this.loading.message = this.translate.instant('MESSAGE.Receiving_information');
  }
  filteModelContent = new FilterModel();
  // modelData = new WidgetContentInfoModel[];
  widgetInfoModel = new WidgetInfoModel();
  cmsApiStoreSubscribe: Subscription;
  @Input()
  loading = new ProgressSpinnerModel();
  ngOnInit() {
    this.widgetInfoModel.title = this.translate.instant('TITLE.Registered_tickets');
    this.widgetInfoModel.description = '';
    this.widgetInfoModel.link = '/ticketing/task';
    this.onActionStatist();
    this.cmsApiStoreSubscribe = this.tokenHelper.getCurrentTokenOnChange().subscribe((next) => {
      this.widgetInfoModel.title = this.translate.instant('TITLE.Registered_tickets');
      this.onActionStatist();
    });
    this.cssClass = `bg-${this.baseColor} ${this.cssClass}`;
    this.textInverseCSSClass = `text-inverse-${this.baseColor}`;
    this.svgCSSClass = `svg-icon--${this.iconColor}`;
  }
  ngOnDestroy(): void {
    this.cmsApiStoreSubscribe.unsubscribe();
  }
  onActionStatist(): void {
    this.loading.Start(this.constructor.name + 'Unread', this.translate.instant('MESSAGE.Get_unread_tickets_statistics'));
    this.loading.Start(this.constructor.name + 'Read', this.translate.instant('MESSAGE.Get_read_tickets_statistics'));
    this.loading.Start(this.constructor.name + 'Answered', this.translate.instant('MESSAGE.Get_answered_tickets_statistics'));
    this.loading.Start(this.constructor.name + 'All', this.translate.instant('MESSAGE.Get_statistics_on_all_tickets'));

    this.widgetInfoModel.set(new WidgetContentInfoModel('Unread', 0, 0, ''));
    this.widgetInfoModel.set(new WidgetContentInfoModel('Read', 1, 0, ''));
    this.widgetInfoModel.set(new WidgetContentInfoModel('Answered', 2, 0, ''));
    this.widgetInfoModel.set(new WidgetContentInfoModel('All', 3, 0, ''));
    this.service.ServiceGetCount(this.filteModelContent).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.widgetInfoModel.set(new WidgetContentInfoModel('All', 3, ret.totalRowCount, '/ticketing/task/'));
        }
        this.loading.Stop(this.constructor.name + 'All');
      },
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'All');
      }
    }
    );
    const filterStatist1 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter = new FilterDataModel();
    fastfilter.propertyName = 'ticketStatus';
    fastfilter.value = EnumTicketStatus.Read;
    filterStatist1.filters.push(fastfilter);
    this.service.ServiceGetCount(filterStatist1).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.widgetInfoModel.set(new WidgetContentInfoModel('Read', 1, ret.totalRowCount, '/ticketing/task/listTicketStatus/' + EnumTicketStatus.Read));
        }
        this.loading.Stop(this.constructor.name + 'Read');
      }
      ,
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'Read');
      }
    }
    );
    const filterStatist2 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter2 = new FilterDataModel();
    fastfilter2.propertyName = 'ticketStatus';
    fastfilter2.value = EnumTicketStatus.Unread;
    filterStatist2.filters.push(fastfilter2);
    this.service.ServiceGetCount(filterStatist2).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.widgetInfoModel.set(new WidgetContentInfoModel('Unread', 0, ret.totalRowCount, '/ticketing/task/listTicketStatus/' + EnumTicketStatus.Unread));
        }
        this.loading.Stop(this.constructor.name + 'Unread');
      }
      ,
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'Unread');
      }
    }
    );
    const filterStatist3 = JSON.parse(JSON.stringify(this.filteModelContent));
    const fastfilter3 = new FilterDataModel();
    fastfilter3.propertyName = 'ticketStatus';
    fastfilter3.value = EnumTicketStatus.Answered;
    filterStatist3.filters.push(fastfilter3);
    this.service.ServiceGetCount(filterStatist3).subscribe({
      next: (ret) => {
        if (ret.isSuccess) {
          this.widgetInfoModel.set(new WidgetContentInfoModel('Answered', 2, ret.totalRowCount, '/ticketing/task/listTicketStatus/' + EnumTicketStatus.Answered));
        }
        this.loading.Stop(this.constructor.name + 'Answered');
      }
      ,
      error: (er) => {
        this.loading.Stop(this.constructor.name + 'Answered');
      }
    }
    );
  }
  translateHelp(t: string, v: string): string {
    return t + v;
  }
}
