import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cms-html-notice',
  templateUrl: './cms-html-notice.component.html',
})
export class CmsHtmlNoticeComponent implements OnInit {
  // Public properties
  @Input() classes: string;
  @Input() icon: string;
  @Input() svg: string;

  constructor() {}

  ngOnInit(): void {}
}

