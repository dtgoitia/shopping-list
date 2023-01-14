import { Item, ItemId } from "../domain/model";
import Paths from "../routes";
import { Mode } from "./Items";
import { Button } from "@blueprintjs/core";
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const ListItem = styled.li`
  margin: 0.5rem 0;
`;

interface ItemListProps {
  items: Item[];
  mode: Mode;
  onRemoveItems: (ids: Set<ItemId>) => void;
}

function ItemList({ items, mode, onRemoveItems }: ItemListProps) {
  const [markedForDeletion, setMarkedForDeletion] = useState<Set<ItemId>>(
    new Set()
  );

  function resetMarks(): void {
    setMarkedForDeletion(new Set());
  }

  function handleMarkToggle(selected: ItemId): void {
    if (markedForDeletion.has(selected)) {
      // Remove ID
      setMarkedForDeletion(
        new Set([...markedForDeletion].filter((id) => id !== selected))
      );
    } else {
      // Add ID
      setMarkedForDeletion(new Set([...markedForDeletion, selected]));
    }
  }

  function handleRemoveItems(): void {
    onRemoveItems(markedForDeletion);
    resetMarks();
  }

  if (mode === Mode.delete) {
    return (
      <>
        <ol>
          {items.map((item) => (
            <ListItem key={item.id}>
              <DeletableItem
                item={item}
                marked={markedForDeletion.has(item.id)}
                onMark={handleMarkToggle}
              />
            </ListItem>
          ))}
        </ol>

        <Button
          onClick={handleRemoveItems}
          className="bp4-button bp4-minimal"
          icon="trash"
          intent="none"
          text={`Delete ${markedForDeletion.size} items`}
        />
      </>
    );
  }

  return (
    <ol>
      {items.map((item) => (
        <ListItem key={item.id}>
          <EditableItem item={item} />
        </ListItem>
      ))}
    </ol>
  );
}

export default ItemList;

const LinkContainer = styled.div`
  margin: 1rem 0;
`;

function EditableItem({ item }: { item: Item }) {
  const path = `${Paths.items}/${item.id}`;
  return (
    <LinkContainer>
      <Link to={path}>{item.name}</Link>
    </LinkContainer>
  );
}

const CrossedOut = styled.s`
  opacity: 0.4;
`;

interface DeletableItemProps {
  item: Item;
  marked: boolean;
  onMark: (id: ItemId) => void;
}

function DeletableItem({ item, marked, onMark }: DeletableItemProps) {
  return (
    <Button
      onClick={() => onMark(item.id)}
      className="bp4-button bp4-minimal"
      intent="none"
    >
      {marked ? <CrossedOut>{item.name}</CrossedOut> : item.name}
    </Button>
  );
}
