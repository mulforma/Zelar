// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import MessageEmbed from Discord.js
const { MessageEmbed } = require("discord.js");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("now-playing")
    // Set command description
    .setDescription("Shows the current song playing."),
  // Set command category
  category: "Music",
  // Execute function
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get queue
    const queue = client.player.getQueue(interaction.guild.id);

    // If queue is empty
    if (!queue) {
      // Send error message
      return interaction.reply({
        content: "There is no song playing.",
      });
    }

    // Loop methods
    const loopMethods = ["None", "Track", "Queue"];

    // Create embed
    const embed = new MessageEmbed()
      // Set title
      .setTitle(queue.current.title)
      // Set URLs
      .setURL(queue.current.url)
      // Set thumbnail
      .setThumbnail(queue.current.thumbnail)
      // Set description
      .setDescription(`${queue.current.author} - ${queue.current.duration} (Loop ${loopMethods[queue.repeatMode]})`)
      // Set footer
      .setFooter({ text: `Requested by ${queue.current.requestedBy.tag}` });

    // Send embed
    await interaction.reply({ embeds: [embed] });
  },
};
