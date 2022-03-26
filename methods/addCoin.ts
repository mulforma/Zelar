import { CommandInteraction } from "discord.js";

import { Knex } from "knex";

import { checkUserExists } from "./checkUserExists";

export const addCoin = async (
  interaction: CommandInteraction,
  db: Knex,
  userId: string,
  guildId: string,
  coinAmount: number,
): Promise<number> => {
  // Make sure the user exists
  checkUserExists(interaction, db, userId, guildId);

  /// Get player's current coins
  const coins: Array<{ coin: number }> = await db("user")
    .select("coin")
    .where("userId", userId)
    .andWhere("serverId", guildId);

  // Add the coin amount to the user's balance
  db("user")
    .update("coin", Number(coins[0].coin) + coinAmount)
    .where("userId", userId)
    .andWhere("serverId", guildId)
    .then();

  // Return the new balance
  return coins[0].coin + coinAmount;
};
