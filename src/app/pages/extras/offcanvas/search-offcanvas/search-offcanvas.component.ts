import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/core/services/layout.service';


@Component({
  selector: 'app-search-offcanvas',
  templateUrl: './search-offcanvas.component.html',
})
export class SearchOffcanvasComponent implements OnInit {
  extrasSearchOffcanvasDirectionCSSClass: string;
  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.extrasSearchOffcanvasDirectionCSSClass = `offcanvas-${this.layout.getProp('extras.search.offcanvas.direction')}`;
  }
}
