import { Component, OnInit } from '@angular/core';
import { HtmlBuilderModel } from 'src/app/core/models/htmlBuilderModel';
@Component({
  selector: 'app-web-designer-builder',
  //template: '<router-outlet></router-outlet>',
  templateUrl: './web-designer-builder.component.html',
  styleUrls: ['./web-designer-builder.component.scss'],
})
export class WebDesignerBuilderComponent implements OnInit {
  constructor() { }
  ngOnInit(): void {
  }
  dataModel: HtmlBuilderModel = new HtmlBuilderModel();



}
