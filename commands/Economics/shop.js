// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import MessageEmbed, MessageButton and MessageActionRow from Discord.js
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("shop")
    // Set command description
    .setDescription("Shows the shop."),
  // Set command category
  category: "Economics",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute (client, interaction) {
    // Get shop
    const shop = await client.db.select("*").from("officialShop");
    },
};