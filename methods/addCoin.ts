import { ChatInputCommandInteraction } from "discord.js";
import { prisma } from "../prisma/connect.js";
import { checkUserExists } from "./checkUserExists.js";

export const addCoin = async (
  interaction: ChatInputCommandInteraction,
  userId: string,
  guildId: string,
  coinAmount: number,
): Promise<number> => {
  // Make sure the user exists
  await checkUserExists(interaction, userId, guildId);
  // Add the coin amount to the user's balance
  await prisma.user.updateMany({
    where: {
      userId: userId,
      serverId: guildId,
    },
    data: {
      coin: {
        increment: coinAmount,
      },
    },
  });

  // Return the balance
  return coinAmount;
};
