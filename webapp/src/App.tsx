import AddItem from "./AddItem";
import "./App.css";
import BuyView from "./Views/Buy";
import InventoryView from "./Views/Inventory";
import {
  addItem,
  addItemToBuy,
  getItemsFromStorage,
  getItemsToBuy,
  Item,
  ItemAutocompleter,
  ItemId,
  ItemName,
  removeItemToBuy,
  ShopName,
} from "./domain";
import storage from "./localStorage";
import { useState } from "react";

function getAutocompleter(items: Item[]): ItemAutocompleter {
  return new ItemAutocompleter(items);
}

function App() {
  const [items, setItems] = useState(getItemsFromStorage());
  storage.items.set(JSON.stringify(items));

  // TODO: investigate if this is recomputing on each render
  // For the time being, it's okay to recompute on each render, but later on you need to
  // make sure that the autocompleter is only rebuilt when a new item is added
  const [autocompleter, setAutocompleter] = useState(getAutocompleter(items));

  const itemsToBuy = getItemsToBuy(items);
  const itemsInInventory = items;

  const handleAddItemToBuy = (id: ItemId) => {
    console.debug(`Adding item ${id}`);
    setItems(addItemToBuy(items, id));
  };
  const handleRemoveItemToBuy = (id: ItemId) => {
    console.debug(`Removing item ${id}`);
    setItems(removeItemToBuy(items, id));
  };
  const handleAddNewItem = (name: ItemName, shop: ShopName) => {
    console.debug(`Adding a new item: ${name} (${shop})`);
    const newItems = addItem(items, name, shop);
    setItems(newItems);
    setAutocompleter(new ItemAutocompleter(newItems));
  };

  /**
   * UX:
   * user types in autocomplete bar
   * no matches: allow adding new item with (phase 2)
   * if matches: add/remove item to/from BuyView
   *
   * Decision: the autocomplete bar belongs to the InventoryView, and it should live
   *     inside the InventoryView component
   */

  return (
    <div>
      <InventoryView
        items={itemsInInventory}
        addItemToBuy={handleAddItemToBuy}
        removeItemToBuy={handleRemoveItemToBuy}
      />
      <AddItem add={handleAddNewItem} />
      <hr />
      <BuyView items={itemsToBuy} tickOff={handleRemoveItemToBuy} />
    </div>
  );
}

export default App;
