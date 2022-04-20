import AddItem from "./AddItem";
import "./App.css";
import BuyView from "./Views/Buy";
import InventoryView from "./Views/Inventory";
import {
  addItem,
  addItemToBuy,
  getItemsFromStorage,
  getItemsToBuy,
  ItemId,
  ItemName,
  removeItemToBuy,
  ShopName,
} from "./domain";
import storage from "./localStorage";
import { useState } from "react";

function App() {
  const [items, setItems] = useState(getItemsFromStorage());
  storage.items.set(JSON.stringify(items));

  const itemsToBuy = getItemsToBuy(items);
  const itemsInInventory = items;

  const handleAddItemToBuy = (id: ItemId) => {
    console.log(`Adding item ${id}`);
    setItems(addItemToBuy(items, id));
  };
  const handleRemoveItemToBuy = (id: ItemId) => {
    console.log(`Removing item ${id}`);
    setItems(removeItemToBuy(items, id));
  };
  const handleAddNewItem = (name: ItemName, shop: ShopName) => {
    console.log(`Adding a new item: ${name} (${shop})`);
    setItems(addItem(items, name, shop));
  };

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
