module.exports = (db, userId, guildId) => {
  return db.select("*").from("user").where("userId", userId).andWhere("serverId", guildId).first();
};
