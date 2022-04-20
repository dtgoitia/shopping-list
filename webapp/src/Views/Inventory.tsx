import { Item, ItemId } from "../domain";

interface SelectableItempProps {
  item: Item;
  onClick: (id: ItemId) => void;
}
function SelectableItem({ item, onClick }: SelectableItempProps) {
  return (
    <li onClick={() => onClick(item.id)}>
      {item.toBuy ? (
        <del>
          {item.id} {item.name}
        </del>
      ) : (
        <span>
          {item.id} {item.name}
        </span>
      )}
    </li>
  );
}
interface InventoryViewProps {
  items: Item[];
  addItemToBuy: (id: ItemId) => void;
  removeItemToBuy: (id: ItemId) => void;
}
function InventoryView({
  items,
  addItemToBuy,
  removeItemToBuy,
}: InventoryViewProps) {
  return (
    <div>
      <h1>Inventory view</h1>
      <p>Use this view to add items to the list</p>
      <ol>
        {items.map((item) => {
          const handleClick = item.toBuy ? removeItemToBuy : addItemToBuy;
          return <SelectableItem item={item} onClick={handleClick} />;
        })}
      </ol>
    </div>
  );
}

export default InventoryView;
