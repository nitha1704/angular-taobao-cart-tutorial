import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartData } from '../interfaces/cart';
import { Shop } from '../interfaces/shop';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItemsMock: Shop[] = [];
  cartItems = new BehaviorSubject<Shop[]>([]);
  totalPrice = new BehaviorSubject<number>(0);
  totalQuantity = new BehaviorSubject<number>(0);
  grandTotalQuantity = new BehaviorSubject<number>(0);
  rate = new BehaviorSubject<number>(5.59);

  constructor(private apiService: ApiService, private http: HttpClient) {}

  addItem(item: any) {
    const isShopExist = this.cartItemsMock.find(
      (x: any) => x.shop_id === item.shop_id
    );
    console.log(isShopExist);
    console.log(item);
    if (isShopExist) {
      const isProductExist = isShopExist.products.find(
        (x: any) => x.sku_id === item.sku_id
      );
      if (!isProductExist) {
        isShopExist.products.push(item);
      }
    } else {
      const newShop = {
        shop_id: item.shop_id,
        shop_title: item.shop_title,
        products: [item],
      };
      this.cartItemsMock.push(newShop);
    }

    const q = this.cartItemsMock.filter((x: any) => x.products.length > 0);
    this.calculateTotalPrice();
    this.cartItems.next(q);
    //console.log(item)
  }

  incrementItem(product: CartData) {
    product.quantity += 1;
    product.totalPrice = product.quantity * product.price;
    this.calculateTotalPrice();
  }

  decrementItem(product: CartData) {
    if (product.quantity > 1) {
      product.quantity -= 1;
      product.totalPrice = product.quantity * product.price;
    }
    this.calculateTotalPrice();
  }

  deleteItem(product: CartData, shop: Shop) {
    const filterShopProduct = shop.products.filter(
      (x: any) => x.sku_id !== product.sku_id
    );
    shop.products = filterShopProduct;

    const filterCartItemsProduct = this.cartItemsMock.filter(
      (x: any) => x.products.length > 0
    );
    this.cartItems.next(filterCartItemsProduct);
    this.calculateTotalPrice();

    console.log(product, shop);
  }

  selectItem(product: CartData) {
    product.selected = !product.selected;
    this.calculateTotalPrice();
  }

  selectAllShopItems(elem: any, shop: Shop) {
    if (elem.checked) {
      shop.products.map((item: any) => (item.selected = true));
    } else {
      shop.products.map((item: any) => (item.selected = false));
    }
    this.calculateTotalPrice();
  }

  selectAllItems(elem: any) {
    const allCheckBox = document.querySelectorAll(
      ".shop input[type='checkbox']"
    );
    if (elem.checked) {
      allCheckBox.forEach((checkbox: any) => (checkbox.checked = true));
      this.cartItemsMock.map((x: any) => {
        return x.products.map((y: any) => (y.selected = true));
      });
    } else {
      allCheckBox.forEach((checkbox: any) => (checkbox.checked = false));
      this.cartItemsMock.map((x: any) => {
        return x.products.map((y: any) => (y.selected = false));
      });
    }
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    // Total Price
    const getTotalPrice = this.cartItemsMock.map((x: any) => {
      return x.products.reduce((acc: any, item: any) => {
        if (item.selected) {
          return (acc += item.totalPrice);
        }
        return (acc += 0);
      }, 0);
    });
    const totalPriceValue = getTotalPrice.reduce((acc: any, item: any) => {
      return (acc += item);
    }, 0);

    // Total Quantity
    const getTotalQuantity = this.cartItemsMock.map((x: any) => {
      return x.products.length;
    });
    const totalQuantityValue = getTotalQuantity.reduce(
      (acc: any, item: any) => {
        return (acc += item);
      },
      0
    );

    // Grand Total Quantity
    const getGrandTotalQuantity = this.cartItemsMock.map((x: any) => {
      return x.products.reduce((acc: any, item: any) => {
        return (acc += item.quantity);
      }, 0);
    });
    const grandTotalQuantityValue = getGrandTotalQuantity.reduce(
      (acc: any, item: any) => {
        return (acc += item);
      },
      0
    );

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    this.grandTotalQuantity.next(grandTotalQuantityValue);
  }

  cartSubmit() {
    console.log(this.cartItems['_value']);
  }

  getCartItem() {
    return this.cartItems.asObservable();
  }

  getTotalPrice() {
    return this.totalPrice.asObservable();
  }

  getTotalQuantity() {
    return this.totalQuantity.asObservable();
  }

  getGrandTotalQuantity() {
    return this.grandTotalQuantity.asObservable();
  }

  getRate() {
    return this.rate.asObservable();
  }

  showCart() {
    console.log(this.cartItemsMock);
  }
}
