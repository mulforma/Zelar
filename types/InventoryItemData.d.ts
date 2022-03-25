export interface InventoryItemData {
  amount: number;
  description: string;
  emoji: string;
  id: number;
  name: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Very Rare" | "Epic" | "Legendary";
  type: string;
  usable: boolean;
}
