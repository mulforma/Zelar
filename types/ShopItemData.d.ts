export interface ShopItem {
  itemId: number;
  itemName: string;
  itemDescription: string;
  itemEmoji: string;
  itemPrice: number;
  itemRarity: number;
  itemType: number;
  usable: boolean | undefined;
}