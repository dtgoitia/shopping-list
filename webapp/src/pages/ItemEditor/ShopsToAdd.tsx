import { Shop, ShopId } from "../../domain/model";
import { Button } from "@blueprintjs/core";
import { useState } from "react";

const DEFAULT_SHOP_ID: ShopId = "DEFAULT";

interface Props {
  shops: Shop[];
  add: (shopId: ShopId) => void;
}
function ShopsToAdd({ shops, add }: Props) {
  const [selectedShop, selectShop] = useState<ShopId>(DEFAULT_SHOP_ID);

  const resetSelection = () => selectShop(DEFAULT_SHOP_ID);

  function handleShopSelectionChange(event: any): void {
    const shopId: ShopId = event.target.value;
    selectShop(shopId);
  }

  function handleAdd(): void {
    add(selectedShop);
    resetSelection();
  }

  if (shops.length === 0) {
    return <p>All shops have been added</p>;
  }

  const selectableShops: Shop[] = [
    { id: DEFAULT_SHOP_ID, name: "Choose a shop..." },
    ...shops,
  ];

  return (
    <div>
      <p>Add shops where you can purchase this item:</p>

      <select onChange={handleShopSelectionChange}>
        {selectableShops.map(({ id, name }) => (
          <option value={id} selected={id === selectedShop}>
            {name}
          </option>
        ))}
      </select>
      <div>
        <Button intent="success" text="Add shop" onClick={handleAdd} />
      </div>
    </div>
  );
}

export default ShopsToAdd;
