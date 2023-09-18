import AddItem from "../../AddItem";
import SearchBox, { NO_FILTER_QUERY } from "../../SearchBox";
import Centered from "../../components/Centered";
import NavBar from "../../components/NavBar";
import { filterInventory, FilterQuery } from "../../domain";
import { ItemManager } from "../../domain/ItemManager";
import { Item, ItemId, ItemName } from "../../domain/model";
import { notify } from "../../notify";
import BlueprintThemeProvider from "../../style/theme";
import AvailableItems from "./AvailableItems";
import ItemsToBuy from "./ItemsToBuy";
import { Alignment, Button, Card, Collapse, Switch } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface Props {
  itemManager: ItemManager;
}

function ShoppingListPage({ itemManager }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [filterQuery, setFilterQuery] = useState<FilterQuery>("");
  const [showInventory, setShowInventory] = useState<boolean>(false);
  const [showUndoList, setShowUndoList] = useState<boolean>(true);

  // This "change" refers to toggling the `item.toBuy` property
  const [changedItems, setChangeItems] = useState<ItemId[]>([]);

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
      ok: () => {
        setChangeItems([...changedItems, id]);
      },
      err: () => {}, // TODO: display error in UI
    });
  }

  function handleRemoveItemToBuy(id: ItemId) {
    console.log(`App.handleAddItemToBuy::removing item ${id}`);
    itemManager.removeFromShoppingList(id).match({
      ok: () => {
        setChangeItems([...changedItems, id]);
      },
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

  function toggleShowUndoList(): void {
    setShowUndoList(!showUndoList);
  }

  function handleUndo(): void {
    // TODO: this logic should probably be a standalone class, agnostic to UI
    if (changedItems.length === 0) {
      notify({ message: `No changes to undo`, intent: "danger" });
      return;
    }
    const lastChangedItemId = changedItems.slice(-1)[0];

    itemManager.get(lastChangedItemId).match({
      Some: (item) => {
        const { id, toBuy } = item as Item;

        const popLastChange = () => setChangeItems(changedItems.slice(0, -1));

        if (toBuy) {
          console.debug(`ShoppingList.handleUndo::removing ${id} from toBuy`);
          itemManager.removeFromShoppingList(id).match({
            ok: () => popLastChange(),
            err: () => {}, // TODO: display error in UI
          });
        } else {
          console.debug(`ShoppingList.handleUndo::adding ${id} to toBuy`);
          itemManager.addToShoppingList(id).match({
            ok: () => popLastChange(),
            err: () => {}, // TODO: display error in UI
          });
        }
      },

      None: () =>
        notify({
          message: `Item ${lastChangedItemId} not found`,
          intent: "danger",
        }),
    });
  }

  function handleClearSearch(): void {
    setFilterQuery(NO_FILTER_QUERY);
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
            clearSearch={() => handleClearSearch()}
          />
          <AvailableItems
            items={filterInventory(itemsInInventory, filterQuery)}
            addItemToBuy={handleAddItemToBuy}
            removeItemToBuy={handleRemoveItemToBuy}
          />
          <AddItem add={handleAddNewItem} />
        </Collapse>

        <Card>
          <Button
            disabled={changedItems.length === 0}
            text={
              changedItems.length === 0
                ? `undo`
                : `undo last (${changedItems.length})`
            }
            icon="undo"
            onClick={handleUndo}
          />
          <Button
            text={showUndoList ? `close` : `open`}
            icon={showUndoList ? `cross` : null}
            onClick={() => toggleShowUndoList()}
          />
          <Collapse isOpen={showUndoList}>
            <ol>
              {changedItems.map((itemId, i) => {
                const name: string = itemManager.get(itemId).match({
                  Some: (item) => (item as Item).name,
                  None: () => itemId,
                });
                return (
                  <li key={itemId}>
                    {i + 1}. {name}
                  </li>
                );
              })}
            </ol>
          </Collapse>
        </Card>

        <ItemsToBuy items={itemsToBuy} tickOff={handleRemoveItemToBuy} />
      </Centered>
    </BlueprintThemeProvider>
  );
}

export default ShoppingListPage;

const SwitchContainer = styled.div`
  margin: 0 0 0 1rem;
  display: flex;
  flex-direction: row-reverse;
`;
