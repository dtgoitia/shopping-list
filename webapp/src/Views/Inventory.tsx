import { Item, ItemId } from "../domain";
import { Button } from "@blueprintjs/core";
import styled from "styled-components";

const GrayedOut = styled.span`
  opacity: 0.3;
`;

interface SelectableItempProps {
  item: Item;
  onClick: (id: ItemId) => void;
  onDelete: (id: ItemId) => void;
}
function SelectableItem({ item, onClick, onDelete }: SelectableItempProps) {
  const otherNames = item.otherNames ? item.otherNames.join(", ") : "";
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
            ({item.id}) {item.name} <GrayedOut>{otherNames}</GrayedOut>
          </del>
        ) : (
          <span>
            ({item.id}) {item.name} <GrayedOut>{otherNames}</GrayedOut>
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
