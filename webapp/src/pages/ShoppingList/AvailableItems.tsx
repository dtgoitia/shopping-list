import { Item, ItemId } from "../../domain/model";
import { Button } from "@blueprintjs/core";
import styled from "styled-components";

const GrayedOut = styled.span`
  opacity: 0.3;
`;

interface SelectableItempProps {
  item: Item;
  onClick: (id: ItemId) => void;
}
function SelectableItem({ item, onClick }: SelectableItempProps) {
  const otherNames = item.otherNames ? item.otherNames.join(", ") : "";
  return (
    <div>
      <Button
        onClick={() => onClick(item.id)}
        className="bp4-button bp4-minimal"
      >
        {item.toBuy ? (
          <del>
            {item.name} <GrayedOut>{otherNames}</GrayedOut>
          </del>
        ) : (
          <span>
            {item.name} <GrayedOut>{otherNames}</GrayedOut>
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
}
function AvailableItems({
  items,
  addItemToBuy,
  removeItemToBuy,
}: InventoryViewProps) {
  return (
    <div>
      <h1>Shopping list (old "Inventory view")</h1>
      <p>Use this view to add items to the list</p>
      <ol>
        {items.map((item) => {
          const handleClick = item.toBuy ? removeItemToBuy : addItemToBuy;
          return (
            <SelectableItem
              key={`item-${item.id}`}
              item={item}
              onClick={handleClick}
            />
          );
        })}
      </ol>
    </div>
  );
}

export default AvailableItems;
