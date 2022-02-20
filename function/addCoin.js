const checkPlayerExists = require("./checkUserExists");

module.exports = async (interaction, db, userId, guildId, coinAmount) => {
  // Make sure the user exists
  checkPlayerExists(interaction, db, userId, guildId);

  /// Get player's current coins
  const coins = await db.select("coin").from("user").where("userId", userId).andWhere("serverId", guildId)

  // Add the coin amount to the user's balance
  db("user")
    .update("coin", Number(coins[0].coin) + coinAmount)
    .where("userId", userId)
    .andWhere("serverId", guildId)
  
  // Return the new balance
  return coins[0].coin + coinAmount;
};
