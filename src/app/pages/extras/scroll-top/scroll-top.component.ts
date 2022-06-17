import { Component, OnInit, AfterViewInit } from '@angular/core';
import { KTUtil } from 'src/assets/js/components/util';
import KTLayoutScrolltop from 'src/assets/js/layout/extended/scrolltop';


@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
})
export class ScrollTopComponent implements OnInit, AfterViewInit {
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    KTUtil.ready(() => {
      // Init Scrolltop
      KTLayoutScrolltop.init('kt_scrolltop');
    });
  }
}
