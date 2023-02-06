import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/core/services/layout.service';

@Component({
  selector: 'app-notifications-offcanvas',
  templateUrl: './notifications-offcanvas.component.html',
})
export class NotificationsOffcanvasComponent implements OnInit {
  extrasNotificationsOffcanvasDirectionCSSClass: string;

  constructor(private layout: LayoutService) { }
  ngOnInit(): void {
    this.extrasNotificationsOffcanvasDirectionCSSClass = `offcanvas-${this.layout.getProp(
      'extras.notifications.offcanvas.direction'
    )}`;
  }
}
