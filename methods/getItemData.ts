import { prisma } from "../prisma/connect.js";

export const getItemData = (selector: string, value: any) => {
  return prisma.globalItems.findFirst({ where: { [selector]: value } });
};
