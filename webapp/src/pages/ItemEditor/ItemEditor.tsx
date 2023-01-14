import Centered from "../../components/Centered";
import {
  addItemPrice,
  addItemToShop,
  deleteShopFromItem,
  ItemManager,
  setItemName,
  setItemOtherNames,
} from "../../domain/ItemManager";
import { Item, ItemName, Price, ShopId } from "../../domain/model";
import { ALL_SHOPS } from "../../domain/shops";
import Paths from "../../routes";
import BlueprintThemeProvider from "../../style/theme";
import ItemShops from "./ItemShops";
import ShopsToAdd from "./ShopsToAdd";
import { Position, Toaster } from "@blueprintjs/core";
import { Button, Card, Label } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const BackLinkContainer = styled.div`
  display: flex;
  flex-direction: row-reverse;
`;

const DRAFT_ITEM: Item = {
  id: "item_0000000000",
  name: "",
  otherNames: [],
  shops: [],
  toBuy: false,
};

interface Props {
  itemManager: ItemManager;
}
function ItemEditor({ itemManager }: Props) {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState<Item>(DRAFT_ITEM);

  function handleNameChange(event: any): void {
    const name: ItemName = event.target.value;
    setItem(setItemName(item, name));
  }

  function handleOtherNamesChange(event: any): void {
    const otherNames: ItemName[] = event.target.value.split(",");
    setItem(setItemOtherNames(item, otherNames));
  }

  function handleAddShop(shopId: ShopId): void {
    addItemToShop(item, shopId).match({
      ok: (updatedItem) => {
        setItem(updatedItem);
      },
      err: (reason) => console.error(reason),
    });
  }

  function handleDeleteShop(shopId: ShopId): void {
    deleteShopFromItem(item, shopId).match({
      ok: (updatedItem) => {
        setItem(updatedItem);
      },
      err: (reason) => console.error(reason),
    });
  }

  function handleAddPrice(shopId: ShopId, price: Price): void {
    addItemPrice(item, shopId, price).match({
      ok: (updatedItem) => {
        setItem(updatedItem);
      },
      err: (reason) => console.error(reason),
    });
  }

  function handleSave(): void {
    itemManager.update({ item }).match({
      ok: () => {
        // Show pop up
        Toaster.create({
          className: "recipe-toaster",
          position: Position.BOTTOM,
        }).show({
          message: `Item "${item.name}" successfully saved`,
          intent: "success",
        });
      },
      err: (reason) => console.error(reason),
    });
  }

  // TODO: add more changes

  useEffect(() => {
    if (itemId === undefined) {
      return;
    }

    itemManager.get(itemId).match({
      Some: (receivedData) => setItem(receivedData as Item),
      None: () => navigate(Paths.notFound),
    });
  }, [itemManager, itemId, navigate]);

  const shopIdsInItem = new Set<ShopId>(item.shops.map((shop) => shop.shopId));
  const itemShops = ALL_SHOPS.filter(({ id }) => shopIdsInItem.has(id));
  const shopsNotInItem = ALL_SHOPS.filter(
    ({ id }) => shopIdsInItem.has(id) === false
  );

  return (
    <BlueprintThemeProvider>
      <Centered>
        <BackLinkContainer>
          <Link to={Paths.items}>
            <Button intent="none" text="back" icon="arrow-left" />
          </Link>
        </BackLinkContainer>

        <Label>
          name:
          <input
            type="text"
            className={"bp4-input"}
            value={item.name}
            placeholder="Name"
            onChange={handleNameChange}
          />
        </Label>

        <Label>
          other names:
          <input
            type="text"
            className={"bp4-input"}
            value={item.otherNames.join(",")}
            placeholder="Other names"
            onChange={handleOtherNamesChange}
          />
        </Label>

        <Card>
          <h3>Shops</h3>
          <ItemShops
            shops={itemShops}
            removeShop={handleDeleteShop}
            addPrice={handleAddPrice}
          />
          <ShopsToAdd shops={shopsNotInItem} add={handleAddShop} />
        </Card>

        <Button intent="success" text="Save" onClick={handleSave} />

        <pre>itemId: {itemId}</pre>
        <pre>{JSON.stringify(item, null, 2)}</pre>
      </Centered>
    </BlueprintThemeProvider>
  );
}

export default ItemEditor;
