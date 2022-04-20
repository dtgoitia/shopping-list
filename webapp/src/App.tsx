import "./App.css";
import BuyView from "./Views/Buy";
import InventoryView from "./Views/Inventory";
import { ITEMS } from "./config";
import { addItemToBuy, getItemsToBuy, ItemId, removeItemToBuy } from "./domain";
import { useState } from "react";

function App() {
  const [items, setItems] = useState([...ITEMS]);
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
