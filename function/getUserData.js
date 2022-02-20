// Import checkUserExists
const checkUserExists = require("./checkUserExists");

module.exports = (interaction, db, userId, guildId) => {
  // Check if user exists
  checkUserExists(interaction, db, userId, guildId);
  // Get user data
  return db.select("*").from("user").where("userId", userId).andWhere("serverId", guildId).first();
};
