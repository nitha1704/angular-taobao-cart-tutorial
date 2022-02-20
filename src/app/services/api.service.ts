import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import mockData from '../pages/product/mockData.json';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  isLoading = new BehaviorSubject<boolean>(false);
  product = new BehaviorSubject<any>(mockData);
  productUrl = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  getProduct(url: string) {
    this.isLoading.next(true);
    const httpHeadersValue = new HttpHeaders({
      'content-type': 'application/json',
      'x-rapidapi-host': 'taobao-tmall-16881.p.rapidapi.com',
      'x-rapidapi-key': '9e63c904f7mshffc7c7d91dfe655p1f18f8jsn9a73f679f6a0',
    });

    const isTaobao = url.includes('taobao');
    const isTmall = url.includes('tmall');
    let productId = '';

    if (isTaobao) {
      let indexPosition = 0;
      const indexPattern1 = url.lastIndexOf('?id=');
      const indexPattern2 = url.lastIndexOf('&id=');

      if (indexPattern1 !== -1) {
        indexPosition = indexPattern1;
        console.log('indexPattern1');
      } else if (indexPattern2 !== -1) {
        indexPosition = indexPattern2;
        console.log('indexPattern2');
      }

      const getIdUrl1 = url.slice(indexPosition + 4);
      const getIdUrl2 = getIdUrl1.indexOf('&');
      if (getIdUrl2 !== -1) {
        productId = getIdUrl1.slice(0, getIdUrl2);
      } else {
        productId = getIdUrl1;
      }
      this.productUrl.next(`http://item.taobao.com/item.htm?id=${productId}`);
    }

    if (isTmall) {
      let indexPosition = 0;
      const indexPattern1 = url.lastIndexOf('?id=');
      const indexPattern2 = url.lastIndexOf('&id=');

      if (indexPattern1 !== -1) {
        indexPosition = indexPattern1;
        console.log('indexPattern1');
      } else if (indexPattern2 !== -1) {
        indexPosition = indexPattern2;
        console.log('indexPattern2');
      }

      const getIdUrl1 = url.slice(indexPosition + 4);
      const getIdUrl2 = getIdUrl1.indexOf('&');
      if (getIdUrl2 !== -1) {
        productId = getIdUrl1.slice(0, getIdUrl2);
      } else {
        productId = getIdUrl1;
      }
      this.productUrl.next(`https://detail.tmall.com/item.htm?id=${productId}`);
    }
  
    return this.http.get<any>(
      `https://taobao-tmall-16881.p.rapidapi.com/api/tkl/item/detail?provider=taobao&id=${productId}`,
      { headers: httpHeadersValue }
    );
  }

  getProductArray() {
    return this.product.asObservable();
  }

  getProductUrl() {
    return this.productUrl.asObservable();
  }
  getIsLoading() {
    return this.isLoading.asObservable();
  }
}
