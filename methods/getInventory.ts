import { CommandInteraction } from "discord.js";
import { checkUserExists } from "./checkUserExists.js";
import { prisma } from "../database/connect.js";

export const getInventory = async (interaction: CommandInteraction, userId: string, serverId: string): Promise<any> => {
  // Make sure the user exists
  checkUserExists(interaction, userId, serverId);
  // Get the user inventory from the database
  const userData = (await prisma.user.findFirst({ where: { userId: BigInt(userId) } }))!;
  // Parse the inventory
  userData.inventory = JSON.parse(String(userData.inventory));
  // Return inventory
  return userData.inventory;
};
