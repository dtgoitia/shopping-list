// TODO: on the first phase, hardcore available shops, you can later on allow adding and removing shops
// export class ShopManager {}
import { Shop, ShopId } from "../domain/model";
import { unreachable } from "./devex";
import { SortAction } from "./sort";

export const ALL_SHOPS: Shop[] = [
  { id: "shop_aaaaaaaaaa", name: "Lidl" },
  { id: "shop_bbbbbbbbbb", name: "Morrisons" },
  { id: "shop_cccccccccc", name: "Tesco" },
  { id: "shop_dddddddddd", name: "Sainsburys" },
  { id: "shop_eeeeeeeeee", name: "Savers" },
].sort(sortShopsAlphabetically);

export const INDEXED_SHOPS: Map<ShopId, Shop> = (function () {
  const index = new Map<ShopId, Shop>();
  ALL_SHOPS.forEach((shop) => {
    index.set(shop.id, shop);
  });
  return index;
})();

function sortShopsAlphabetically(a: Shop, b: Shop): SortAction {
  const name_a = a.name.toLowerCase();
  const name_b = b.name.toLowerCase();
  switch (true) {
    case name_a === name_b:
      return SortAction.PRESERVE_ORDER;
    case name_a < name_b:
      return SortAction.FIRST_A_THEN_B;
    case name_a > name_b:
      return SortAction.FIRST_B_THEN_A;
    default:
      throw unreachable();
  }
}
