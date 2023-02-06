import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/core/services/layout.service';

@Component({
  selector: 'app-notifications-dropdown-inner',
  templateUrl: './notifications-dropdown-inner.component.html',
})
export class NotificationsDropdownInnerComponent implements OnInit {
  extrasNotificationsDropdownStyle: 'light' | 'dark' = 'dark';
  activeTabId:
    | 'topbar_notifications_notifications'
    | 'topbar_notifications_events'
    | 'topbar_notifications_logs' = 'topbar_notifications_notifications';
  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.extrasNotificationsDropdownStyle = this.layout.getProp(
      'extras.notifications.dropdown.style'
    );
  }

  setActiveTabId(tabId) {
    this.activeTabId = tabId;
  }

  getActiveCSSClasses(tabId) {
    if (tabId !== this.activeTabId) {
      return '';
    }
    return 'active show';
  }
}
