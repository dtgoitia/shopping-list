import { ItemManager } from "./domain/ItemManager";
import ItemEditor from "./pages/ItemEditor/ItemEditor";
import ItemsPage from "./pages/ItemExplorer";
import PageNotFound from "./pages/PageNotFound";
import ShoppingListPage from "./pages/ShoppingList";
import Paths from "./routes";
import { Route, Routes } from "react-router-dom";

interface Props {
  itemManager: ItemManager;
}

export function AppUi({ itemManager }: Props) {
  return (
    <Routes>
      <Route
        path={Paths.root}
        element={<ShoppingListPage itemManager={itemManager} />}
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
