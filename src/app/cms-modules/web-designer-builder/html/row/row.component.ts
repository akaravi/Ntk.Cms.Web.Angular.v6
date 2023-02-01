import {
  ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PublicHelper } from 'src/app/core/helpers/publicHelper';
import { HtmlBuilderModel } from 'src/app/core/models/htmlBuilderModel';
import { CmsToastrService } from 'src/app/core/services/cmsToastr.service';

@Component({
  selector: 'app-web-designer-builder-html-row',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.scss'],
})
export class WebDesignerBuilderHtmlRowComponent implements OnInit {
  constructor(
    private cmsToastrService: CmsToastrService,
    public publicHelper: PublicHelper,
    private cdr: ChangeDetectorRef,
    public translate: TranslateService,
  ) {

  }
  @Input() dataModel: HtmlBuilderModel = new HtmlBuilderModel();
  @Output() dataModelChange: EventEmitter<HtmlBuilderModel> = new EventEmitter<HtmlBuilderModel>()

  update(value) {
    this.dataModelChange.emit(value);
  }



  ngOnInit(): void {


  }
}
