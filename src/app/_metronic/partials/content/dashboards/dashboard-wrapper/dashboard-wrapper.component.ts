import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/core/services/layout.service';


@Component({
  selector: 'app-dashboard-wrapper',
  templateUrl: './dashboard-wrapper.component.html',
})
export class DashboardWrapperComponent implements OnInit {
  demo: string;
  constructor(private layout: LayoutService) {}

  ngOnInit(): void {
    this.demo = this.layout.getProp('demo');
  }
}
