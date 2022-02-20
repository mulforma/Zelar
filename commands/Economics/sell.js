// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("sell")
    // Set command description
    .setDescription("Sell an item")
    // Add string option
    .addStringOption(option =>
      option
        // Set option name
        .setName("item")
        // Set option description
        .setDescription("The item to sell")
        // Set require
        .setRequired(true)
    )
    // Add integer option
    .addIntegerOption(option =>
      option
        // Set option name
        .setName("amount")
        // Set option description
        .setDescription("The amount of the item to sell")
        // Set require
        .setRequired(true)
    )
    // Add integer option
    .addIntegerOption(option =>
      option
        // Set option name
        .setName("price")
        // Set option description
        .setDescription("The price of the item to sell")
        // Set require
        .setRequired(true)
    ),
  // Set command category
  category: "Misc",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
  
  },
};
