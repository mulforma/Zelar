module.exports = (interaction, db, userId, guildId) => {
  db.select("*")
    .from("user")
    .where("userId", userId)
    .andWhere("serverId", guildId)
    .then((user) => {
      if (user.length <= 0) {
        // Check if interaction has been replied to
        if (interaction.replied) {
          // If so, send channel message
          return interaction.channel.send("You don't have a profile yet! Type `/profile` to create one!");
        } else {
          // If not, reply to interaction
          return interaction.reply("You don't have a profile yet! Type `/profile` to create one!");
        }
      }
    });
};
