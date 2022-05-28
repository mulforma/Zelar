import { CommandInteraction } from "discord.js";
import { prisma } from "../database/connect";
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
  const user = prisma.user.update({
    where: {
      userId,
      serverId,
    },
    data: {
      coins: {
        add: coinAmount,
      }
    }
  });

  // Return the new balance
  return user.coins;
};
