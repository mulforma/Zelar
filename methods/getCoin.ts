import { CommandInteraction } from "discord.js";
import { prisma } from "../database/connect.js";
import { checkUserExists } from "./checkUserExists.js";

export const getCoin = async (interaction: CommandInteraction, userId: string, serverId: string): Promise<BigInt|null> => {
  // Make sure the user exists
  checkUserExists(interaction, userId, serverId);

  // Get the user coins from the database
  const userData = await prisma.user.findFirst({ where: { userId: BigInt(userId) } });

  // Return the coins
  return userData!.coin;
};
