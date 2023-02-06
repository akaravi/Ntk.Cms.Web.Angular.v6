import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/core/services/layout.service';

@Component({
  selector: 'app-cart-offcanvas',
  templateUrl: './cart-offcanvas.component.html',
})
export class CartOffcanvasComponent implements OnInit {
  extrasCartOffcanvasDirectionCSSClass = 'offcanvas-right';
  constructor(private layout: LayoutService) { }

  ngOnInit(): void {
    this.extrasCartOffcanvasDirectionCSSClass = `offcanvas-${this.layout.getProp(
      'extras.cart.offcanvas.direction'
    )}`;
  }
}
