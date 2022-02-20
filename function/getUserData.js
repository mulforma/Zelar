module.exports = (db, userId, guildId) => {
  return db.select("*").from("user").where("userId", userId).andWhere("guildId", guildId).first();
};
