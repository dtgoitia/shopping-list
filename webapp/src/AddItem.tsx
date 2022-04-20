import { ItemName, ShopName } from "./domain";
import { useState } from "react";

interface AddItemProps {
  add: (name: ItemName, shop: ShopName) => void;
}
function AddItem({ add }: AddItemProps) {
  const [name, setName] = useState<string>("");
  const [shop, setShop] = useState<string>("");
  function handleNameChange(event: any) {
    setName(event.target.value);
  }
  function handleShopChange(event: any) {
    setShop(event.target.value);
  }
  return (
    <div>
      <p>Add a new item:</p>
      <input
        type="text"
        value={name ? name : undefined}
        placeholder="name"
        onChange={handleNameChange}
      />
      <input
        type="text"
        value={shop ? shop : undefined}
        placeholder="shop"
        onChange={handleShopChange}
      />
      <button onClick={() => add(name, shop)} type="submit">
        Add
      </button>
    </div>
  );
}
export default AddItem;
