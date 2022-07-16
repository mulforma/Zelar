import { CommandInteraction } from "discord.js";
import { checkUserExists } from "./checkUserExists.js";
import { prisma } from "../prisma/connect.js";

export const getInventory = async (interaction: CommandInteraction, userId: string, guildId: string): Promise<any> => {
  // Make sure the user exists
  await checkUserExists(interaction, userId, guildId);
  // Get the user inventory from the database
  const userData = (await prisma.user.findFirst({ where: { userId: BigInt(userId) } }))!;
  // Parse the inventory
  userData.inventory =
    typeof userData.inventory === "object" ? userData.inventory : JSON.parse(String(userData.inventory));
  // Return inventory
  return userData.inventory;
};
