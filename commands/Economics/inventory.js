// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("inventory")
    // Set command description
    .setDescription("View your current inventory."),
  // Set command category
  category: "Misc",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    client.db
      .select("inventory")
      .from("users")
      .where("userId", interaction.message.author.id)
      .then(async (result) => {
        if (result[0].inventory.length === 0) {
          interaction.message.channel.send("You have no items in your inventory.");
        } else {
          interaction.message.channel.send(
            `You have the following items in your inventory:\n${Object.keys(JSON.parse(result[0].inventory)).join(
              ", ",
            )}`,
          );
        }
      });
  },
};
