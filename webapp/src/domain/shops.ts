// TODO: on the first phase, hardcore available shops, you can later on allow adding and removing shops
// export class ShopManager {}
import { Shop, ShopId, ShopName } from "../domain/model";
import { unreachable } from "./devex";
import { SortAction } from "./sort";

const SHOPS = new Map<ShopId, ShopName>([
  ["shop_aaaaaaaaaa", "Lidl"],
  ["shop_bbbbbbbbbb", "Morrisons"],
  ["shop_cccccccccc", "Tesco"],
  ["shop_dddddddddd", "Sainsburys"],
  ["shop_eeeeeeeeee", "Savers"],
]);

export function shopExists(id: ShopId): boolean {
  return SHOPS.has(id);
}

export const ALL_SHOPS = (function (): Shop[] {
  const result: Shop[] = [];
  for (const [id, name] of SHOPS.entries()) {
    result.push({ id, name });
  }

  return result.sort(sortShopsAlphabetically);
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
