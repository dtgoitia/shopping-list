import AddItem from "./AddItem";
import "./App.css";
import SearchBox from "./SearchBox";
import BuyView from "./Views/Buy";
import InventoryView from "./Views/Inventory";
import Centered from "./components/Centered";
import NavBar from "./components/NavBar";
import { filterInventory, FilterQuery } from "./domain";
import { ItemManager } from "./domain/ItemManager";
import { Item, ItemId, ItemName } from "./domain/model";
import ItemEditor from "./pages/ItemEditor/ItemEditor";
import ItemsPage from "./pages/Items";
import PageNotFound from "./pages/PageNotFound";
import Paths from "./routes";
import BlueprintThemeProvider from "./style/theme";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

interface Props {
  itemManager: ItemManager;
}

function OldPage({ itemManager }: Props) {
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

  const handleRemoveItem = (id: ItemId) => {
    console.log(`App.handleRemoveItem::removing an item: ${id}`);
    itemManager.delete({ id }).match({
      ok: () => console.log(),
      err: () => console.log("App.handleRemoveItem::error removing an item"),
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
          removeItem={handleRemoveItem}
        />
        <AddItem add={handleAddNewItem} />

        <BuyView items={itemsToBuy} tickOff={handleRemoveItemToBuy} />
      </Centered>
    </BlueprintThemeProvider>
  );
}

function App({ itemManager }: Props) {
  return (
    <Routes>
      <Route
        path={Paths.root}
        element={<OldPage itemManager={itemManager} />}
      />
      <Route
        path={Paths.items}
        element={<ItemsPage itemManager={itemManager} />}
      />
      <Route
        path={Paths.itemEditor}
        element={<ItemEditor itemManager={itemManager} />}
      />
      <Route path={Paths.notFound} element={<PageNotFound />} />
    </Routes>
  );
}

export default App;
