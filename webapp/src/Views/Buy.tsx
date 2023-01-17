import { Item, ItemId, ItemShop, Shop, ShopId } from "../domain/model";
import { INDEXED_SHOPS } from "../domain/shops";
import styled from "styled-components";

const NO_SHOP: Shop = { id: "shop_nooooshop", name: "No shop" };
const NO_ITEMP_SHOP: ItemShop = { shopId: NO_SHOP.id, priceHistory: [] };

type ItemsByShop = Map<ShopId, Set<ItemId>>;

function byShop(items: Item[]): ItemsByShop {
  const index: ItemsByShop = new Map<ShopId, Set<ItemId>>();

  for (const item of items) {
    const itemShops = item.shops.length > 0 ? item.shops : [NO_ITEMP_SHOP];

    for (const shop of itemShops) {
      const { shopId } = shop;
      const { id: itemId } = item;

      // Leverage the fact that you can mutate the set
      if (index.has(shopId)) {
        (index.get(shopId) as Set<ItemId>).add(itemId);
      } else {
        index.set(shopId, new Set<ItemId>([itemId]));
      }
    }
  }

  return index;
}

const ListItem = styled.li`
  margin: 1rem 0;
`;

interface ShopItemProps {
  item: Item;
  tickOff: (id: ItemId) => void;
}
function ShopItem({ item, tickOff }: ShopItemProps) {
  return <ListItem onClick={() => tickOff(item.id)}>{item.name}</ListItem>;
}

interface ShopItemsProps {
  shop: Shop;
  items: Item[];
  tickOff: (id: ItemId) => void;
}
function ShopItems({ shop, items, tickOff }: ShopItemsProps) {
  return (
    <div>
      <p>
        <b>{shop.name}</b>
      </p>
      <ol>
        {items.map((item) => (
          <ShopItem key={item.id} item={item} tickOff={tickOff} />
        ))}
      </ol>
    </div>
  );
}

function getShopById(id: ShopId): Shop | undefined {
  if (id === NO_SHOP.id) {
    return NO_SHOP;
  }

  return INDEXED_SHOPS.get(id);
}

interface BuyViewProps {
  items: Item[];
  tickOff: (id: ItemId) => void;
}
function BuyView({ items, tickOff }: BuyViewProps) {
  const itemByShop = byShop(items);

  return (
    <div>
      <h1>Buy view</h1>
      <p>Use this view to purchase items in each store</p>
      {[...itemByShop].map(([shopId, itemIds]) => {
        const shop = getShopById(shopId);
        if (shop === undefined) {
          return <pre key={shopId}>No Shop found for {shopId} ID</pre>;
        }

        const itemsInThisShop = items.filter((item) => itemIds.has(item.id));

        return (
          <ShopItems
            key={shopId}
            shop={shop}
            items={itemsInThisShop}
            tickOff={tickOff}
          />
        );
      })}
    </div>
  );
}

export default BuyView;
