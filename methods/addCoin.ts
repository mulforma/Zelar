import { CommandInteraction } from "discord.js";
import { Knex } from "knex";

const checkPlayerExists = require("./checkUserExists");

exports = async (interaction: CommandInteraction, db: Knex, userId: number, guildId: number, coinAmount: number) => {
  // Make sure the user exists
  checkPlayerExists(interaction, db, userId, guildId);

  /// Get player's current coins
  const coins = await db("user").select("coin").where("userId", userId).andWhere("serverId", guildId);

  // Add the coin amount to the user's balance
  db("user")
    .update("coin", Number(coins[0].coin) + coinAmount)
    .where("userId", userId)
    .andWhere("serverId", guildId)
    .then();

  // Return the new balance
  return coins[0].coin + coinAmount;
};
