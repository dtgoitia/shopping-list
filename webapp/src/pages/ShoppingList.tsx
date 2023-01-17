import AddItem from "../AddItem";
import SearchBox from "../SearchBox";
import BuyView from "../Views/Buy";
import InventoryView from "../Views/Inventory";
import Centered from "../components/Centered";
import NavBar from "../components/NavBar";
import { filterInventory, FilterQuery } from "../domain";
import { ItemManager } from "../domain/ItemManager";
import { Item, ItemId, ItemName } from "../domain/model";
import BlueprintThemeProvider from "../style/theme";
import { Alignment, Collapse, Switch } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface Props {
  itemManager: ItemManager;
}

function ShoppingList({ itemManager }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [filterQuery, setFilterQuery] = useState<FilterQuery>("");
  const [showInventory, setShowInventory] = useState<boolean>(false);

  const itemsInInventory = items;
  const itemsToBuy = items.filter((item) => item.toBuy === true);

  useEffect(() => {
    const subscription = itemManager.changes$.subscribe((_) => {
      setItems(itemManager.getAll());
    });

    setItems(itemManager.getAll());

    return () => {
      subscription.unsubscribe();
    };
  }, [itemManager]);

  function handleAddItemToBuy(id: ItemId) {
    console.log(`App.handleAddItemToBuy::adding item ${id}`);
    itemManager.addToShoppingList(id).match({
      ok: () => {},
      err: () => {}, // TODO: display error in UI
    });
  }

  function handleRemoveItemToBuy(id: ItemId) {
    console.log(`App.handleAddItemToBuy::removing item ${id}`);
    itemManager.removeFromShoppingList(id).match({
      ok: () => {},
      err: () => {}, // TODO: display error in UI
    });
  }

  function handleAddNewItem(name: ItemName, otherNames: ItemName[]) {
    console.log(`App.handleAddNewItem::adding a new item: ${name}`);
    itemManager.add({ name, otherNames }).match({
      ok: () => console.log(`App.handleAddNewItem::added a new item: ${name}`),
      err: () => console.log("App.handleAddNewItem::error adding a new item"),
    });
  }

  function toggleShowInventory(): void {
    setShowInventory(!showInventory);
  }

  return (
    <BlueprintThemeProvider>
      <Centered>
        <NavBar />
        <SwitchContainer>
          <Switch
            checked={showInventory}
            label="Show inventory"
            onChange={() => toggleShowInventory()}
            alignIndicator={Alignment.RIGHT}
          />
        </SwitchContainer>
        <Collapse isOpen={showInventory}>
          <SearchBox
            query={filterQuery}
            onChange={setFilterQuery}
            placeholder={"Filter inventory..."}
          />
          <InventoryView
            items={filterInventory(itemsInInventory, filterQuery)}
            addItemToBuy={handleAddItemToBuy}
            removeItemToBuy={handleRemoveItemToBuy}
          />
          <AddItem add={handleAddNewItem} />
        </Collapse>

        <BuyView items={itemsToBuy} tickOff={handleRemoveItemToBuy} />
      </Centered>
    </BlueprintThemeProvider>
  );
}

export default ShoppingList;

const SwitchContainer = styled.div`
  margin: 0 0 0 1rem;
  display: flex;
  flex-direction: row-reverse;
`;
