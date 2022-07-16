export interface ShopItemData {
  itemId: number;
  itemName: string;
  itemDescription: string;
  itemEmoji: string;
  itemPrice: number;
  itemRarity: number;
  itemType: number;
  usable?: boolean;
  sellable?: boolean;
  price?: number;
}
