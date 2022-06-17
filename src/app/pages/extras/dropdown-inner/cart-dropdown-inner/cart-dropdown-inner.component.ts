import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/core/services/layout.service';

@Component({
  selector: 'app-cart-dropdown-inner',
  templateUrl: './cart-dropdown-inner.component.html',
})
export class CartDropdownInnerComponent implements OnInit {
  extrasCartDropdownStyle: 'light' | 'dark' = 'light';
  constructor(private layout: LayoutService) {}

  ngOnInit(): void {
    this.extrasCartDropdownStyle = this.layout.getProp(
      'extras.cart.dropdown.style'
    );
  }
}
