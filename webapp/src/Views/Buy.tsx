import { Item, ItemId, ShopName } from "../domain";

interface ItemsByShop {
  [x: ShopName]: Item[];
}

function byShop(items: Item[]): ItemsByShop {
  const kk: ItemsByShop = {};

  items.forEach((item) => {
    if (!kk.hasOwnProperty(item.shop)) {
      kk[item.shop] = [item];
    } else {
      kk[item.shop].push(item);
    }
  });

  return kk;
}

interface ShopItemProps {
  item: Item;
  tickOff: (id: ItemId) => void;
}
function ShopItem({ item, tickOff }: ShopItemProps) {
  return (
    <li onClick={() => tickOff(item.id)}>
      {item.id} {item.name}
    </li>
  );
}
interface ShopItemsProps {
  shop: ShopName;
  items: Item[];
  tickOff: (id: ItemId) => void;
}
function ShopItems({ shop, items, tickOff }: ShopItemsProps) {
  return (
    <div>
      <p>
        <b>{shop}</b>
      </p>
      <ol>
        {items.map((item) => (
          <ShopItem key={item.id} item={item} tickOff={tickOff} />
        ))}
      </ol>
    </div>
  );
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
      {Object.entries(itemByShop).map(([shop, items]) => (
        <ShopItems key={shop} shop={shop} items={items} tickOff={tickOff} />
      ))}
    </div>
  );
}

export default BuyView;
