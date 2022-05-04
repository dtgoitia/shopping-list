import { Item, ItemId } from "../domain";
import { Button } from "@blueprintjs/core";

interface SelectableItempProps {
  item: Item;
  onClick: (id: ItemId) => void;
  onDelete: (id: ItemId) => void;
}
function SelectableItem({ item, onClick, onDelete }: SelectableItempProps) {
  return (
    <div>
      <Button
        onClick={() => onDelete(item.id)}
        className="bp4-button bp4-minimal"
        icon="trash"
      />
      <Button
        onClick={() => onClick(item.id)}
        className="bp4-button bp4-minimal"
      >
        {item.toBuy ? (
          <del>
            {item.id} {item.name}
          </del>
        ) : (
          <span>
            {item.id} {item.name}
          </span>
        )}
      </Button>
    </div>
  );
}
interface InventoryViewProps {
  items: Item[];
  addItemToBuy: (id: ItemId) => void;
  removeItemToBuy: (id: ItemId) => void;
  removeItem: (id: ItemId) => void;
}
function InventoryView({
  items,
  addItemToBuy,
  removeItemToBuy,
  removeItem,
}: InventoryViewProps) {
  return (
    <div>
      <h1>Inventory view</h1>
      <p>Use this view to add items to the list</p>
      <ol>
        {items.map((item) => {
          const handleClick = item.toBuy ? removeItemToBuy : addItemToBuy;
          return (
            <SelectableItem
              key={`item-${item.id}`}
              item={item}
              onClick={handleClick}
              onDelete={removeItem}
            />
          );
        })}
      </ol>
    </div>
  );
}

export default InventoryView;
