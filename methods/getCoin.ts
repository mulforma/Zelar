import { CommandInteraction } from "discord.js";
import { prisma } from "../prisma/connect.js";
import { checkUserExists } from "./checkUserExists.js";

export const getCoin = async (
  interaction: CommandInteraction,
  userId: string,
  serverId: string,
): Promise<bigint | null> => {
  // Make sure the user exists
  checkUserExists(interaction, userId, serverId);

  // Get the user coins from the database
  const userData = await prisma.user.findFirst({ where: { userId: BigInt(userId) } });

  // Return the coins
  return userData!.coin;
};
