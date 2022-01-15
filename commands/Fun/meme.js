// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import axios
const axios = require("axios");
// Import MessageEmbed from Discord.js
const { MessageEmbed } = require("discord.js");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("meme")
    // Set command description
    .setDescription("Send a meme"),
  // Set command category
  category: "Misc",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute (client, interaction) {
    // Fetch meme by axios
    const { data } = await axios.get("https://meme-api.herokuapp.com/gimme");
    // Send meme
    interaction.reply({
      embeds: [new MessageEmbed().setTitle(data.title).setImage(data.url).setURL(data.postLink).setColor("GREEN")],
    });
  },
};
