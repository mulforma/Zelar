// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import axios
const axios = require("axios");
// Import MessageEmbed, MessageButton and MessageActionRow from Discord.js
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("meme")
    // Set command description
    .setDescription("Send a meme"),
  // Set command category
  category: "Fun",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    // Fetch meme by axios
    const { data } = await axios.get("https://meme-api.herokuapp.com/gimme");
    // Create new button
    const button = new MessageActionRow().addComponents(
      new MessageButton()
        // Set button label
        .setLabel("Next")
        // Set button id
        .setCustomId("next")
        // Set button styles
        .setStyle("PRIMARY"),
    );
    // Send meme
    interaction.reply({
      embeds: [new MessageEmbed().setTitle(data.title).setImage(data.url).setURL(data.postLink).setColor("GREEN")],
      components: [button],
    });

    // Filter for answer buttons
    const filter = (i) =>
      // Check if id is Confirm and if it is the same user
      i.customId === "next" && i.user.id === interaction.user.id;

    // Collect answer
    const collector = interaction.channel.createMessageComponentCollector(filter, { time: 60000 });

    // When answer is collected
    collector.on("collect", async (i) => {
      // Check if custom id is next
      if (i.customId === "next") {
        // Defer update
        await i.deferUpdate();
        // Fetch a new meme
        const { data } = await axios.get("https://meme-api.herokuapp.com/gimme");
        // Send meme
        await interaction.editReply({
          embeds: [new MessageEmbed().setTitle(data.title).setImage(data.url).setURL(data.postLink).setColor("GREEN")],
          components: [button],
        });
      }
    });
  },
};
