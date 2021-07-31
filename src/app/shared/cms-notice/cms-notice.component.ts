import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cms-notice',
  templateUrl: './cms-notice.component.html',
})
export class CmsNoticeComponent implements OnInit {
  // Public properties
  @Input() classes: string;
  @Input() icon: string;
  @Input() svg: string;

  constructor() {}

  ngOnInit(): void {}
}

