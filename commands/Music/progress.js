// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("progress")
    // Set command description
    .setDescription("Show the progress of the current song."),
  // Set command category
  category: "Music",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute (client, interaction) {
    // Get queue
    const queue = client.player.getQueue(interaction.guild.id);
  
    // Check if queue is empty
    if (!queue) {
      // Send error message
      return interaction.reply({
        content: "There is no song playing."
      });
    }
    
    // Get progress bar
    const progress = queue.createProgressBar();
    // Get player timestamp
    const timestamp = queue.getPlayerTimestamp();
  
    // Check if timestamp.progress is Infinity
    if (timestamp.progress === Infinity) {
      // Send error message
      return interaction.reply({
        content: "Can't get the progress of the live stream."
      });
    }
    
    // Send progress message
    interaction.reply({ content: `${progress} (**${timestamp.progress}**%)` });
  },
};
