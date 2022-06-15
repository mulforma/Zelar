import { CommandInteraction } from "discord.js";
import { prisma } from "../database/connect.js";
import { checkUserExists } from "./checkUserExists.js";

export const addCoin = async (
  interaction: CommandInteraction,
  userId: string,
  serverId: string,
  coinAmount: number,
): Promise<number> => {
  // Make sure the user exists
  checkUserExists(interaction, userId, serverId);

  // Add the coin amount to the user's balance
  prisma.user.updateMany({
    where: {
      userId: BigInt(userId),
      serverId: BigInt(serverId),
    },
    data: {
      coin: Number(coinAmount),
    },
  });

  // Return the balance
  return Number(coinAmount);
};
