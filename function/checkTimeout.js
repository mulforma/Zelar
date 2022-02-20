const ms = require("ms");
module.exports = (interaction, db, cmdName, timeoutMs, userData) => {
  // Get index
  const index = userData.timeout.commands.findIndex((i) => i.command === cmdName);

  // Check if index is valid
  if (index !== -1) {
    // Set timeout
    const timeout = userData.timeout.commands.find((i) => i.command === "rob");
    // Check if timeout reaches the end
    if (Number(timeout.time) + timeoutMs - Date.now() <= 0) {
      // Remove timeout
      userData.timeout = userData.timeout.commands.filter((i) => i.command !== "rob");
    } else {
      // Send error message
      return interaction.reply(
        `<@${interaction.user.id}> You can use this command again in ${ms(
          Number(timeout.time) + timeoutMs - Date.now(),
        )}`,
      );
    }
  }
  // Check if index is -1
  if (index === -1) {
    // Add timeout
    userData.timeout.commands.push({
      command: cmdName,
      time: Date.now(),
    });
  } else {
    // Update timeout
    userData.timeout.commands[index].time = Date.now();
  }

  // Save timeout
  db("user")
    .update({
      timeout: userData.timeout,
    })
    .where({
      userId: interaction.user.id,
      serverId: interaction.guild.id,
    })
    .then();
};
