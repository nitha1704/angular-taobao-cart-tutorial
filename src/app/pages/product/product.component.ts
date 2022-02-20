import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import mockData from './mockData.json';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  isLoading: boolean = false;
  productUrl: string = '';
  product: any = [];
  productPriceDefault: Number = 0;
  propsList: any;
  bigImageUrl: any;
  mostExpensivePrice: Number = 0;
  quantity: number = 1;
  quantityInStock: Number = -1;
  isButtonDisabled: Boolean = true;

  prop1Value: string = 'p1';
  prop2Value: string = 'p2';
  propValue: string = '';
  propName: string = '';
  propImg: string = '';

  skuId: string = '';

  constructor(
    private apiService: ApiService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.subscribeGlobalVariables();
    this.getData();
    this.isProductNoProps();
  }

  subscribeGlobalVariables() {
    this.apiService
      .getProductUrl()
      .subscribe((value) => (this.productUrl = value));

    this.apiService
      .getIsLoading()
      .subscribe((value) => (this.isLoading = value));

    this.apiService.getProductArray().subscribe((value) => {
      this.product = value;
    });
  }

  getData() {
    const filterPropsList1 = Object.entries(this.product['props_list']);
    const filterPropsList2 = filterPropsList1.map((item: any) => {
      return { properties: item[0], prop_name: item[1] };
    });

    const propsImgs = this.product['prop_imgs']['prop_img'];
    const propsList = filterPropsList2.filter((x: any) => {
      return propsImgs.every((y: any) => {
        return y.properties !== x.properties;
      });
    });
    const slicePropsList = propsList.map((item: any) => {
      const i = item.prop_name.lastIndexOf(':');
      const sliceProp = item.prop_name.slice(i + 1);
      return { ...item, prop_name: sliceProp };
    });

    const getPrice = this.product.skus.sku.map((x: any) => x.price);
    const getMostExpensivePrice = Math.max(...getPrice);

    this.productPriceDefault = Number(this.product.price);
    this.propsList = slicePropsList;
    this.bigImageUrl = this.product.pic_url;
    this.mostExpensivePrice = getMostExpensivePrice;

    console.log(this.product);
  }

  switchBigImage(item: any, elem: any) {
    const elemParent = elem.parentNode;
    const allSmallImages = elemParent.querySelectorAll('.small-image');
    allSmallImages.forEach((smallImage: any) => {
      smallImage.classList.remove('active');
    });
    elem.classList.add('active');
    this.bigImageUrl = item.url;

    console.log(item.url);
  }

  prop1Active(elem: any, item: any) {
    const prop1Elems = elem.parentNode.querySelectorAll('.item');
    if (elem.classList.contains('active')) {
      this.prop1Value = 'p15555';
      prop1Elems.forEach((item: any) => {
        item.classList.remove('active');
      });
    } else {
      this.prop1Value = item.properties;
      prop1Elems.forEach((item: any) => {
        item.classList.remove('active');
      });
      elem.classList.add('active');
    }
    this.findMatchPrice();
  }

  prop2Active(elem: any, item: any) {
    const prop2Elems = elem.parentNode.querySelectorAll('.item');
    if (elem.classList.contains('active')) {
      this.prop2Value = 'p25555';
      prop2Elems.forEach((item: any) => {
        item.classList.remove('active');
      });
    } else {
      this.propImg = item.url;
      this.prop2Value = item.properties;
      prop2Elems.forEach((item: any) => {
        item.classList.remove('active');
      });
      elem.classList.add('active');
    }
    this.findMatchPrice();
  }

  findMatchPrice() {
    let propValueMock = `${this.prop1Value};${this.prop2Value}`;
    let propValueMock2 = `${this.prop2Value};${this.prop1Value}`;
    let propValueMock3 = `${this.prop1Value}`;
    let propValueMock4 = `${this.prop2Value}`;

    const matchProp = this.product.skus.sku.find(
      (item: any) => item.properties === propValueMock
    );
    const matchProp2 = this.product.skus.sku.find(
      (item: any) => item.properties === propValueMock2
    );
    const matchProp3 = this.product.skus.sku.find(
      (item: any) => item.properties === propValueMock3
    );
    const matchProp4 = this.product.skus.sku.find(
      (item: any) => item.properties === propValueMock4
    );

    const getPropImg = Object.entries(this.product.props_img);
    const getPropImg2 = getPropImg.map((item: any) => {
      return { properties: item[0], url: item[1] };
    });
    const propImg = getPropImg2.find(
      (item: any) => item.properties === this.prop2Value
    );
    if (propImg) {
      this.bigImageUrl = propImg.url;
    }

    if (matchProp || matchProp2 || matchProp3 || matchProp4) {
      this.quantityInStock = matchProp
        ? matchProp.quantity
        : matchProp2
        ? matchProp2.quantity
        : matchProp3
        ? matchProp3.quantity
        : matchProp4
        ? matchProp4.quantity
        : undefined;
      this.quantityInStock = Number(this.quantityInStock);
      this.isButtonDisabled = false;
    } else {
      this.quantityInStock = -1;
      this.isButtonDisabled = true;
    }

    this.propValue = matchProp
      ? matchProp.price
      : matchProp2
      ? matchProp2.price
      : matchProp3
      ? matchProp3.price
      : matchProp4
      ? matchProp4.price
      : undefined;

    this.propName = matchProp
      ? matchProp.properties_name
      : matchProp2
      ? matchProp2.properties_name
      : matchProp3
      ? matchProp3.properties_name
      : matchProp4
      ? matchProp4.properties_name
      : undefined;
    if (this.propName) {
      let getIndexPropName = this.propName.lastIndexOf(':');
      let getPropName = this.propName.slice(getIndexPropName + 1);
      this.propName = getPropName;
    }

    this.skuId = matchProp
      ? matchProp.sku_id
      : matchProp2
      ? matchProp2.sku_id
      : matchProp3
      ? matchProp3.sku_id
      : matchProp4
      ? matchProp4.sku_id
      : undefined;

    console.log('matchProp', matchProp);
    console.log('matchProp2', matchProp2);
    console.log('matchProp3', matchProp3);
    console.log('matchProp4', matchProp4);
    console.log('propImg', this.propImg);

    console.log(this.quantityInStock);
  }

  isPropListArray() {
    return Array.isArray(this.product.props_list);
  }
  isProductNoProps() {
    const isProductNoProps =
      this.isPropListArray() && this.product.skus.sku.length === 0;
    if (isProductNoProps) {
      this.isButtonDisabled = false;
      this.quantityInStock = this.product.num;
    }
  }

  getQuantity() {
    const zxcv = this.product.skus.sku.map((item: any) => {
      return Number(item.quantity);
    });
    const qwes = zxcv.reduce((acc: any, item: any) => {
      return (acc += item);
    }, 0);
    console.log(qwes);
  }

  incrementItem() {
    this.quantity += 1;
  }
  decrementItem() {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  getProduct(url: string) {
    this.apiService.getProduct(url).subscribe(
      (value) => {
        console.log(value);
        this.product = value.item;
        this.resetProps();
        this.getData();
        this.isProductNoProps();
        this.apiService.isLoading.next(false);
      },
      (err) => {
        console.log(err);
        console.log('nnooo');
        this.apiService.isLoading.next(false);
      }
    );
  }

  addProduct() {
    const product = {
      title: this.product.title,
      propName: this.propName,
      price: Number(this.propValue),
      detail_url: this.product.detail_url,
      image: this.product.pic_url,
      prop_image: this.propImg,
      quantity: this.quantity,
      sku_id: this.skuId,
      seller_id: this.product.seller_id,
      seller_nick: this.product.nick,
      shop_id: this.product.shop_id,
      shop_title: this.product.seller_info.title,
    };
    const product2 = {
      ...product,
      totalPrice: product.quantity * product.price
    }
    console.log(product2);
    this.cartService.addItem(product2);
  }

  resetProps() {
    this.prop1Value = '';
    this.prop2Value = '';
    this.propValue = '';
    this.quantityInStock = -1;
    this.isButtonDisabled = true;
  }

  show() {
    console.log(this.product);
    console.log('prop1Value', this.prop1Value);
    console.log('prop2Value', this.prop2Value);
    console.log('propValue', this.propValue);
    console.log('quantityInStock', this.quantityInStock);
    console.log('productPriceDefault', this.productPriceDefault);
    console.log('mostExpensivePrice', this.mostExpensivePrice);
    //this.findMatchPrice();
  }
}
