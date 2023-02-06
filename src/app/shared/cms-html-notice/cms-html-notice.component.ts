import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cms-html-notice',
  templateUrl: './cms-html-notice.component.html',
})
export class CmsHtmlNoticeComponent implements OnInit {
  static nextId = 0;
  id = ++CmsHtmlNoticeComponent.nextId;
  // Public properties
  @Input() classes: string;
  @Input() icon: string;
  @Input() svg: string;

  constructor() { }

  ngOnInit(): void { }
}

