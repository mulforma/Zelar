// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("remove")
    // Set command description
    .setDescription("Remove the song from the queue.")
    // Add number option
    .addNumberOption(option =>
      option
        // Set option name
        .setName("track-number")
        // Set option description
        .setDescription("The track number to remove.")
        // Set option required
        .setRequired(true)
    ),
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
    // Get track number
    const trackNumber = (interaction.options.getNumber("track-number") - 1);

    // Check if queue is empty
    if (!queue) {
      // Send error message
      return await interaction.reply({
        content: "There is no song playing.",
      });
    }
    
    // Remove song
    const success = queue.remove(trackNumber);

    // Check if skip was successful
    if (success) {
      // Send success message
      return await interaction.reply({
        content: "Song removed.",
      });
    } else {
      // Send error message
      return await interaction.reply({
        content: "Something went wrong...",
      });
    }
  },
};
