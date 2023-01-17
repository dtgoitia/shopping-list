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
import { useEffect, useState } from "react";

interface Props {
  itemManager: ItemManager;
}

function ShoppingList({ itemManager }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [filterQuery, setFilterQuery] = useState<FilterQuery>("");

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

  const handleAddItemToBuy = (id: ItemId) => {
    console.log(`App.handleAddItemToBuy::adding item ${id}`);
    itemManager.addToShoppingList(id).match({
      ok: () => {},
      err: () => {}, // TODO: display error in UI
    });
  };

  const handleRemoveItemToBuy = (id: ItemId) => {
    console.log(`App.handleAddItemToBuy::removing item ${id}`);
    itemManager.removeFromShoppingList(id).match({
      ok: () => {},
      err: () => {}, // TODO: display error in UI
    });
  };

  const handleAddNewItem = (name: ItemName, otherNames: ItemName[]) => {
    console.log(`App.handleAddNewItem::adding a new item: ${name}`);
    itemManager.add({ name, otherNames }).match({
      ok: () => console.log(`App.handleAddNewItem::added a new item: ${name}`),
      err: () => console.log("App.handleAddNewItem::error adding a new item"),
    });
  };

  return (
    <BlueprintThemeProvider>
      <Centered>
        <NavBar />
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

        <BuyView items={itemsToBuy} tickOff={handleRemoveItemToBuy} />
      </Centered>
    </BlueprintThemeProvider>
  );
}

export default ShoppingList;
