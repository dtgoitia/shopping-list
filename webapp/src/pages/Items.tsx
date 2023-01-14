import AddItem from "../AddItem";
import SearchBox from "../SearchBox";
import Centered from "../components/Centered";
import NavBar from "../components/NavBar";
import { filterInventory, FilterQuery } from "../domain";
import { ItemManager } from "../domain/ItemManager";
import { unreachable } from "../domain/devex";
import { Item, ItemId, ItemName } from "../domain/model";
import BlueprintThemeProvider from "../style/theme";
import ItemList from "./ItemList";
import { Alignment, Switch } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import styled from "styled-components";

export enum Mode {
  navigate = "navigate",
  delete = "delete",
}

const SwitchContainer = styled.div`
  margin: 0 0 0 1rem;
  display: flex;
  flex-direction: row-reverse;
`;

interface Props {
  itemManager: ItemManager;
}

function ItemsPage({ itemManager }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [mode, setMode] = useState<Mode>(Mode.navigate);

  const [filterQuery, setFilterQuery] = useState<FilterQuery>("");

  function toggleMode(): void {
    if (mode === Mode.navigate) {
      setMode(Mode.delete);
    } else if (mode === Mode.delete) {
      setMode(Mode.navigate);
    } else {
      throw unreachable(`unexpected mode: ${mode}`);
    }
  }

  useEffect(() => {
    const subscription = itemManager.changes$.subscribe((_) => {
      setItems(itemManager.getAll());
    });

    setItems(itemManager.getAll());

    return () => {
      subscription.unsubscribe();
    };
  }, [itemManager]);

  const handleAddNewItem = (name: ItemName, otherNames: ItemName[]) => {
    console.log(`App.handleAddNewItem::adding a new item: ${name}`);
    itemManager.add({ name, otherNames }).match({
      ok: () => console.log(`App.handleAddNewItem::added a new item: ${name}`),
      err: () => console.log("App.handleAddNewItem::error adding a new item"),
    });
  };

  function handleRemoveItems(ids: Set<ItemId>): void {
    for (const id of ids) {
      console.log(`App.handleRemoveItem::removing item ${id}`);
      itemManager.delete({ id }).match({
        ok: () => console.log(),
        err: () =>
          console.log(`App.handleRemoveItem::error removing item ${id}`),
      });
    }
  }

  const filteredItems = filterInventory(items, filterQuery);

  return (
    <BlueprintThemeProvider>
      <Centered>
        <NavBar />
        <SearchBox
          query={filterQuery}
          onChange={setFilterQuery}
          placeholder={"Filter inventory items..."}
        />
        <ItemList
          items={filteredItems}
          mode={mode}
          onRemoveItems={handleRemoveItems}
        />

        <SwitchContainer>
          <Switch
            checked={mode === Mode.delete}
            label="Delete mode"
            onChange={() => toggleMode()}
            alignIndicator={Alignment.RIGHT}
          />
        </SwitchContainer>

        <AddItem add={handleAddNewItem} />
      </Centered>
    </BlueprintThemeProvider>
  );
}

export default ItemsPage;
