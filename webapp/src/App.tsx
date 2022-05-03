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
import BlueprintThemeProvider from "./style/theme";
import { useState } from "react";
import styled from "styled-components";

const Centered = styled.div`
  margin: 0 auto;
  padding: 0 1rem;
  max-width: 800px;
`;
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
    <BlueprintThemeProvider>
      <Centered>
        <InventoryView
          items={itemsInInventory}
          addItemToBuy={handleAddItemToBuy}
          removeItemToBuy={handleRemoveItemToBuy}
        />
        <AddItem add={handleAddNewItem} />
        <BuyView items={itemsToBuy} tickOff={handleRemoveItemToBuy} />
      </Centered>
    </BlueprintThemeProvider>
  );
}

export default App;
