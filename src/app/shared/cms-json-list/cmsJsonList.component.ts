import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cms-json-list',
  templateUrl: './cmsJsonList.component.html',
  styleUrls: ['./cmsJsonList.component.scss']
})
export class CmsJsonListComponent implements OnInit {
  static nextId = 0;
  id = ++CmsJsonListComponent.nextId;
  constructor() { }
  @Input() optionMethod = 1;
  @Input() dataModel: any;
  @Input() optionFields: Map<string, string>;
  @Input() optionViewHead: boolean = true;
  ngOnInit(): void {
  }

}
