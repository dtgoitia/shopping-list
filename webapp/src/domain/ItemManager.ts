import { todo, unreachable } from "./devex";
import { generateId } from "./hash";
import { Hash, Item, ItemId, ItemName, Price, ShopId } from "./model";
import { SortAction } from "./sort";
import { Err, ErrorReason, Maybe, MaybeType, Ok, Result } from "./success";
import { Observable, Subject } from "rxjs";
import { makeTaggedUnion, MemberType } from "safety-match";

export const ITEM_PREFIX = "item";

interface AddItemArgs {
  name: ItemName;
  otherNames: ItemName[];
}

interface UpdateItemArgs {
  item: Item;
}

interface DeleteItemArgs {
  id: ItemId;
}

export class ItemManager {
  public changes$: Observable<ItemChange>;

  private changesSubject: Subject<ItemChange>;
  private items: Map<ItemId, Item>;
  private alreadyInitialized: boolean;

  constructor() {
    this.changesSubject = new Subject<ItemChange>();
    this.changes$ = this.changesSubject.asObservable();
    this.items = new Map<ItemId, Item>();
    this.alreadyInitialized = false;
  }

  public initialize(items: Item[]): Result {
    if (this.alreadyInitialized) {
      return Err(
        `ItemManager.initialize::already initialized and cannot initialize again`
      );
    }

    for (const item of items) {
      this.items.set(item.id, item);
    }

    this.alreadyInitialized = true;
    return Ok(undefined);
  }

  public getAll(): Item[] {
    return [...this.items.values()].sort(sortItemsAlphabetically);
  }

  public add({ name, otherNames }: AddItemArgs): Result {
    const id = this.generateItemId();
    const item: Item = { id, name, otherNames, shops: [], toBuy: false };
    this.items.set(id, item);
    this.changesSubject.next(new ItemAdded(id));
    return Ok(undefined);
  }

  public get(id: ItemId): MaybeType {
    const item = this.items.get(id);
    if (item === undefined) {
      return Maybe.None;
    }

    return Maybe.Some(item);
  }

  public update({ item }: UpdateItemArgs): Result {
    if (this.items.has(item.id) === false) {
      return Err(`ItemManager.update::item ${item.id} not found`);
    }

    this.items.set(item.id, item);
    this.changesSubject.next(new ItemUpdated(item.id));
    return Ok(undefined);
  }

  public delete({ id }: DeleteItemArgs): Result {
    if (this.items.has(id) === false) {
      return Err(`ItemManager.delete::item ${id} not found`);
    }

    this.items.delete(id);
    this.changesSubject.next(new ItemDeleted(id));
    return Ok(undefined);
  }

  // TODO: perhaps this functionality can be a standalone manager in the future if you
  // need to support multiple lists
  public addToShoppingList(id: ItemId): Result {
    const item = this.items.get(id);
    if (item === undefined) {
      return Err(`ItemManager.addToShoppingList::item ${id} not found`);
    }

    if (item.toBuy === true) {
      return Err(
        `ItemManager.addToShoppingList::item ${id} already added to the shopping list` +
          ` and cannot be added again`
      );
    }

    const updatedItem: Item = { ...item, toBuy: true };
    this.items.set(item.id, updatedItem);
    this.changesSubject.next(new ItemUpdated(item.id));
    return Ok(undefined);
  }

  // TODO: perhaps this functionality can be a standalone manager in the future if you
  // need to support multiple lists
  public removeFromShoppingList(id: ItemId): Result {
    const item = this.items.get(id);
    if (item === undefined) {
      return Err(`ItemManager.removeFromShoppingList::item ${id} not found`);
    }

    if (item.toBuy === false) {
      return Err(
        `ItemManager.removeFromShoppingList::item ${id} is not in the shopping list` +
          `and it cannot be removed`
      );
    }

    const updatedItem: Item = { ...item, toBuy: false };
    this.items.set(item.id, updatedItem);
    this.changesSubject.next(new ItemUpdated(item.id));
    return Ok(undefined);
  }

  private generateItemId(): Hash {
    let id: Hash = generateId({ prefix: ITEM_PREFIX });

    // Make sure that no IDs are duplicated - rare, but very painful
    while (this.items.has(id)) {
      id = generateId({ prefix: ITEM_PREFIX });
    }

    return id;
  }
}

function sortItemsAlphabetically(a: Item, b: Item): SortAction {
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

class ItemAdded {
  constructor(public readonly id: ItemId) {}
}

class ItemUpdated {
  constructor(public readonly id: ItemId) {}
}

class ItemDeleted {
  constructor(public readonly id: ItemId) {}
}

type ItemChange = ItemAdded | ItemUpdated | ItemDeleted;

const ItemResult = makeTaggedUnion({
  ok: (item: Item) => item,
  err: (reason: ErrorReason) => reason,
});
type ItemResultType = MemberType<typeof ItemResult>;

export function setItemName(item: Item, name: ItemName): Item {
  return { ...item, name };
}

export function setItemOtherNames(item: Item, otherNames: ItemName[]): Item {
  return { ...item, otherNames };
}

export function addItemToShop(item: Item, shopId: ShopId): ItemResultType {
  // TODO: this validation does not make sense here, the ShopId comes from the
  // ShopManager itself, so the ShopId must exist
  // if (shopExists(shopId) === false) {
  //   return Result.err(`Shop ${shopId} is not supported`);
  // }

  const itemShops = new Set<ShopId>(item.shops.map((shop) => shop.shopId));
  if (itemShops.has(shopId)) {
    return ItemResult.err(
      `Item ${item.id} already has shop ${shopId} and cannot as the same shop twice`
    );
  }

  const updatedItem: Item = {
    ...item,
    shops: [
      ...item.shops,
      {
        shopId,
        priceHistory: [],
      },
    ],
  };

  return ItemResult.ok(updatedItem);
}

export function deleteShopFromItem(item: Item, shopId: ShopId): ItemResultType {
  const shopToDelete = item.shops.filter((shop) => shop.shopId === shopId)[0];
  const shopToDeleteHasPrices: boolean = shopToDelete.priceHistory.length > 0;

  if (shopToDeleteHasPrices) {
    return ItemResult.err(
      `shop ${shopId} in item ${item.id} must be empty to be deleted, but it` +
        ` currently contains ${item.shops.length} prices`
    );
  }

  const updatedItem: Item = {
    ...item,
    shops: item.shops.filter((shop) => shop.shopId !== shopId),
  };

  return ItemResult.ok(updatedItem);
}

export function addItemPrice(
  item: Item,
  shopId: ShopId,
  price: Price
): ItemResultType {
  todo();
  return ItemResult.ok(item);
}

// export function removeItemPriceFromShop(
//   item: Item,
//   shop: ShopId,
//   price: Price
// ): ItemResultType {
//   // TODO
//   todo();
//   // return ItemResult.ok(updatedItem);
// }
