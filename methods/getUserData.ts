import { CommandInteraction } from "discord.js";
import { checkUserExists } from "./checkUserExists.js";
import { prisma } from "../database/connect.js";

export const getUserData = async (interaction: CommandInteraction, userId: string, guildId: string): Promise<any> => {
  // Check if user exists
  checkUserExists(interaction, userId, guildId);
  // Get user data
  const user = (await prisma.user.findFirst({ where: { userId: BigInt(userId), serverId: BigInt(guildId) } }))!;
  // Parse user inventory
  user.inventory = typeof (user.inventory) !== "object" ? JSON.parse(String(user.inventory)) : user.inventory;
  // Return user
  return user;
};
