import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartData } from '../../interfaces/cart';
import { Shop } from '../../interfaces/shop';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cartItems: Shop[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;
  grandTotalQuantity: number = 0;
  rate: number = 0;
  productUrl: string = '';

  constructor(
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.subscribeGlobalVariables();
  }

  subscribeGlobalVariables(): void {
    this.cartService
      .getCartItem()
      .subscribe((value) => (this.cartItems = value));

    this.cartService
      .getTotalPrice()
      .subscribe((value) => (this.totalPrice = value));

    this.cartService
      .getTotalQuantity()
      .subscribe((value) => (this.totalQuantity = value));

    this.cartService
      .getGrandTotalQuantity()
      .subscribe((value) => (this.grandTotalQuantity = value));

    this.cartService.getRate().subscribe((value) => (this.rate = value));
  }

  incrementItem(product: CartData): void {
    this.cartService.incrementItem(product);
  }

  decrementItem(product: CartData): void {
    this.cartService.decrementItem(product);
  }

  deleteItem(product: CartData, item: any): void {
    this.cartService.deleteItem(product, item);
  }

  selectItem(product: CartData): void {
    this.cartService.selectItem(product);
  }

  selectAllShopItems(elem: any, shop: Shop): void {
    this.cartService.selectAllShopItems(elem, shop);
  }

  selectAllItems(elem: any): void {
    this.cartService.selectAllItems(elem);
  }

  cartSubmit(): void {
    this.cartService.cartSubmit();
  }

  showCart() {
    this.cartService.showCart();
  }
}
