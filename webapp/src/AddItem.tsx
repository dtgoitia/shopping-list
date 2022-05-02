import { ItemName, ShopName } from "./domain";
import { Button } from "@blueprintjs/core";
import { useState } from "react";

interface AddItemProps {
  add: (name: ItemName, shop: ShopName) => void;
}
function AddItem({ add }: AddItemProps) {
  const [name, setName] = useState<string>();
  const [shop, setShop] = useState<string>();

  function handleNameChange(event: any) {
    setName(event.target.value);
  }

  function handleShopChange(event: any) {
    setShop(event.target.value);
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    if (!name || name === "") return;
    if (!shop || shop === "") return;
    add(name, shop);
    setName("");
    setShop("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Add a new item:</p>
      <input
        type="text"
        className={"bp4-input"}
        value={name}
        placeholder="Name"
        onChange={handleNameChange}
      />
      <input
        type="text"
        className={"bp4-input"}
        value={shop}
        placeholder="Shop"
        onChange={handleShopChange}
      />
      <Button intent="success" text="Add" type="submit" />
    </form>
  );
}
export default AddItem;
