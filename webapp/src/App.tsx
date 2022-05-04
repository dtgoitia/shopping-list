import AddItem from "./AddItem";
import "./App.css";
import SearchBox from "./SearchBox";
import BuyView from "./Views/Buy";
import InventoryView from "./Views/Inventory";
import {
  addItem,
  addItemToBuy,
  filterInventory,
  FilterQuery,
  getItemsFromStorage,
  getItemsToBuy,
  ItemId,
  ItemName,
  removeItem,
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
  const [filterQuery, setFilterQuery] = useState<FilterQuery>("");
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
  const handleRemoveItem = (id: ItemId) => {
    console.log(`Removing item (ID: ${id})`);
    setItems(removeItem(items, id));
  };

  return (
    <BlueprintThemeProvider>
      <Centered>
        <SearchBox query={filterQuery} onChange={setFilterQuery} />
        <InventoryView
          items={filterInventory(itemsInInventory, filterQuery)}
          addItemToBuy={handleAddItemToBuy}
          removeItemToBuy={handleRemoveItemToBuy}
          removeItem={handleRemoveItem}
        />
        <AddItem add={handleAddNewItem} />
        <BuyView items={itemsToBuy} tickOff={handleRemoveItemToBuy} />
      </Centered>
    </BlueprintThemeProvider>
  );
}

export default App;
