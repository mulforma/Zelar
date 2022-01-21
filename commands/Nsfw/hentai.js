// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import axios
const axios = require("axios");
// Import MessageEmbed
const { MessageEmbed } = require("discord.js");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("hentai")
    // Set command description
    .setDescription("Sends a random hentai image (from gelbooru)")
    // Add string option
    .addStringOption((option) =>
      option
        // Set option name
        .setName("tag")
        // Set option description
        .setDescription("The tag to search for (Separate with commas)")
        // Set option required
        .setRequired(false),
    ),
  // Set command category
  category: "Nsfw",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    // Check if channel is NSFW
    if (!interaction.channel.nsfw) {
      // Send error message
      await interaction.reply({
        embeds: [new MessageEmbed().setColor("#ff0000").setDescription("This channel is not NSFW")],
      });
      // Return
      return;
    }

    // Get tags
    const tags = interaction.options.getString("tag")
      ? // If tag is undefined
        interaction.options.getString("tag")
      : // Else
        "";

    // Get random page
    const page = Math.floor(Math.random() * 100) + 1;

    // Get random image
    const image = await axios.get(
      `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=1&pid=${page}${
        tags ? `&tags=${tags.join("+")}` : ""
      }`,
    );

    // If no image
    if (!image.data.post[0]) {
      // Send error message
      await interaction.reply({
        embeds: [new MessageEmbed().setColor("#ff0000").setDescription("No image found")],
      });
      return;
    }

    // Send image
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Image from " + image.data.post[0].owner)
          .setColor("#ffb6c1")
          .setImage(image.data.post[0].file_url)
          .setFooter({ text: `rating: ${image.data.post[0].rating} | score: ${image.data.post[0].score}` })
          .setURL(`https://gelbooru.com/index.php?page=post&s=view&id=${image.data.post[0].id}`),
      ],
    });
  },
};
