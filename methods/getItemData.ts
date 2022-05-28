import { ShopItemData } from "../types/ShopItemData";
import { prisma } from "../database/connect";

export const getItemData = (selector: string, value: string): Promise<Array<ShopItemData>> => {
  return prisma.globalItems.findOne({ where: { [selector]: value } });
};
