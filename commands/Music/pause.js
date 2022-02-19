// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("pause")
    // Set command description
    .setDescription("Pauses the current song."),
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

    // Check if queue is empty
    if (!queue) {
      // Send error message
      return interaction.reply({
        content: "There is no song playing.",
      });
    }

    // Pause queue
    const success = queue.setPaused(true);

    // Check if queue was paused
    if (success) {
      // Send success message
      return interaction.reply({
        content: "The song has been paused.",
      });
    }
    return interaction.reply({
      content: "There was an error pausing the song.",
    });
  },
};
