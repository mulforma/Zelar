const checkPlayerExists = require("./checkUserExists");

module.exports = (interaction, db, userId, guildId, coinAmount) => {
  // Make sure the user exists
  checkPlayerExists(interaction, db, userId, guildId);

  /// Get player's current coins
  const coins = db.select("coin").from("user").where("userId", userId).andWhere("serverId", guildId).first();

  // Add the coin amount to the user's balance
  db("user")
    .where("userId", userId)
    .andWhere("serverId", guildId)
    .update({
      coin: coins.coin + coinAmount,
    });

  // Return the new balance
  return coins.coin + coinAmount;
};
