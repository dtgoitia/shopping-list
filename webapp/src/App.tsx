import "./App.css";
import BuyView from "./Views/Buy";
import InventoryView from "./Views/Inventory";
import { ITEMS, LOAD_ITEMS_FROM_CONFIG } from "./config";
import {
  addItemToBuy,
  getItemsFromStorage,
  getItemsToBuy,
  ItemId,
  removeItemToBuy,
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

  return (
    <div>
      <InventoryView
        items={itemsInInventory}
        addItemToBuy={handleAddItemToBuy}
        removeItemToBuy={handleRemoveItemToBuy}
      />
      <hr />
      <BuyView items={itemsToBuy} tickOff={handleRemoveItemToBuy} />
    </div>
  );
}

export default App;
