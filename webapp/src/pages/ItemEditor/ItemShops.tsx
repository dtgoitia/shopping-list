import { now } from "../../domain/datetimeUtils";
import { todo } from "../../domain/devex";
import { MoneyInCents, Price, Shop, ShopId, Unit } from "../../domain/model";
import { Button, Collapse, Switch } from "@blueprintjs/core";
import { useState } from "react";

interface Props {
  shops: Shop[];
  removeShop: (id: ShopId) => void;
  addPrice: (shopId: ShopId, price: Price) => void;
}

function ItemShops({ shops, removeShop, addPrice }: Props) {
  return (
    <>
      {shops.map((shop) => (
        <ShopEditor shop={shop} onRemove={removeShop} addPrice={addPrice} />
      ))}
    </>
  );
}

export default ItemShops;

interface ShopViewProps {
  shop: Shop;
  onRemove: (id: ShopId) => void;
  addPrice: (shopId: ShopId, price: Price) => void;
}
function ShopEditor({ shop, onRemove, addPrice }: ShopViewProps) {
  const [showPrices, setShowPrices] = useState<boolean>(false);

  function togglePriceEditor(): void {
    setShowPrices(!showPrices);
  }

  function handleAddPrice(price: Price): void {
    addPrice(shop.id, price);
  }

  return (
    <div>
      <h4>{shop.name}</h4>
      <Button
        onClick={() => onRemove(shop.id)}
        className="bp4-button bp4-minimal"
        icon="trash"
        intent="none"
        text={`Delete "${shop.name}" shop`}
      />
      <Switch
        checked={showPrices}
        label="Show prices"
        onChange={() => togglePriceEditor()}
      />
      <Collapse isOpen={showPrices}>
        <AddPrice add={handleAddPrice} />
      </Collapse>
    </div>
  );
}

interface AddPriceProps {
  add: (price: Price) => void;
}
function AddPrice({ add }: AddPriceProps) {
  const [money, setMoney] = useState<MoneyInCents | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [unit /*, setUnit*/] = useState<Unit>(Unit.ud);

  function handleMoneyChange(event: any): void {
    const raw: string = event.target.value;
    setMoney(toMoney(raw));
  }

  function handleQuantityChange(event: any): void {
    const updatedQuantity: number = event.target.value;
    todo();
    setQuantity(updatedQuantity);
  }

  function handleAdd(): void {
    add({
      date: now(),
      price: money,
      quantity,
      quantityUnit: unit,
    } as Price);
  }

  return (
    <div>
      <input
        type="number"
        className={"bp4-input"}
        value={money ? money / 100 : undefined}
        placeholder="Price"
        onChange={handleMoneyChange}
      />
      <input
        type="number"
        className={"bp4-input"}
        value={quantity}
        placeholder="Quantify"
        onChange={handleQuantityChange}
      />

      <Button intent="success" text="Add price" onClick={handleAdd} />
    </div>
  );
}

function toMoney(raw: string): MoneyInCents {
  const n = Number(raw);
  return Math.round(n * 100);
}
