// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import MessageEmbed from Discord.js
const { MessageEmbed } = require("discord.js");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("queue")
    // Set command description
    .setDescription("Shows the current queue."),
  // Set command category
  category: "Music",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    // Get queue
    const queue = client.player.getQueue(interaction.guild.id);

    // If queue is empty
    if (!queue) {
      // Send error message
      return await interaction.reply({
        embed: new MessageEmbed().setColor("#ff0000").setDescription("There is no queue."),
      });
    }

    // If there is no next song
    if (!queue.tracks[0]) {
      // Send error message
      return await interaction.reply({
        embeds: [new MessageEmbed().setColor("#ff0000").setDescription("There is no queue after this song.")],
      });
    }

    // Create embed
    const embed = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle("Queue")
      .setDescription(
        `${queue.tracks.map((track, index) => `${index + 1}. [${track.title}](${track.url})`).join("\n")}`,
      )
      .setThumbnail(client.user.displayAvatarURL());

    // Send embed
    await interaction.reply({ embeds: [embed] });
  },
};
