export type Hash = string;
export type ItemId = string;
export type ItemName = string;
export type Quantity = string;
export type ShopId = string;
export type ShopName = string;
export type MoneyInCents = number;

export interface Shop {
  id: ShopId;
  name: ShopName;
}
// TODO: think how to make easy to compare prices in different units
export enum Unit {
  ud,
  g,
  kg,
  L,
  mL,
}

export interface Price {
  // £6.75 per 1_234ud
  date: Date;
  price: MoneyInCents; // 675
  quantity: number; // 1_234
  quantityUnit: Unit; // ud
}

export interface ItemShop {
  shopId: ShopId;
  priceHistory: Price[];
}
export interface Item {
  id: ItemId;
  name: ItemName;
  otherNames: ItemName[];
  shops: ItemShop[];
  toBuy: boolean;
  quantity?: Quantity;
}
