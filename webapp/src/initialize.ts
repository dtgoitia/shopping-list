import { ItemManager } from "./domain/ItemManager";
import { BrowserStorage } from "./domain/browserStorage";
import { Storage } from "./localStorage";

interface App {
  itemManager: ItemManager;
}

export function initialize(): App {
  // Inject dependencies
  const storage = new Storage();
  const itemManager = new ItemManager();
  const browserStorage = new BrowserStorage({ itemManager, storage });

  // // Load persisted data
  console.log(`initialize.ts::initialize::Starting initialization...`);
  const items = browserStorage.getItems();
  console.log(`initialize.ts::initialize::${items.length} items found`);

  itemManager.initialize(items).match({
    ok: () =>
      console.log(
        `initialize.ts::initialize::ItemManager successfully initialized`
      ),
    err: (reason) => {
      console.error(reason);
    },
  });

  // console.log(`initialize.ts::initialize::Initialization completed`);
  // itemManager.initialize({ activities });
  // completedActivityManager.initialize({ completedActivities });
  console.log(`initialize.ts::initialize::Initialization completed`);

  return { itemManager };
}
