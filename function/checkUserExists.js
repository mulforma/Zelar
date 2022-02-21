module.exports = (interaction, db, userId, guildId) => {
  db.select("*")
    .from("user")
    .where("userId", userId)
    .andWhere("serverId", guildId)
    .then((user) => {
      if (user.length <= 0) {
        return interaction.reply("You don't have a profile yet! Type `/profile` to create one!");
      }
    });
};
