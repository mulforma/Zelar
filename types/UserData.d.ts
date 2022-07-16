import { InventoryItemData } from "./InventoryItemData";

export interface UserData {
  serverId: number;
  userId: number;
  coin: number;
  xp: number;
  level: number;
  jobs: string;
  timeout: {
    commands: Array<TimeoutCommandData>;
  };
  inventory: {
    items: Array<InventoryItemData>;
  };
  id: number;
}

export interface TimeoutCommandData {
  command: string;
  time: number;
}
