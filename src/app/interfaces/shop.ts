import { CartData } from "./cart";

export interface Shop {
  shop_id: string;
  shop_title: string;
  products: CartData[];
}
