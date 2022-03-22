// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import QueueRepeatMode from discord-player
const { QueueRepeatMode } = require("discord-player");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("loop")
    // Set command description
    .setDescription("Loop the current song.")
    // Add string option
    .addStringOption((option) =>
      option
        // Set option name
        .setName("mode")
        // Set option description
        .setDescription("Loop mode. (Off, Track and Queue)")
        // Set option required
        .setRequired(true),
    ),
  // Set command category
  category: "Music",
  // Execute function
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get queue
    const queue = client.player.getQueue(interaction.guild.id);

    // Check if queue is not playing
    if (!queue) {
      // Send error message
      return interaction.reply({ content: "There is no song playing." });
    }

    // Get mode
    const mode = interaction.options.getString("mode");

    if (!["off", "track", "queue"].includes(mode.toLowerCase())) {
      // Send error message
      return interaction.reply({ content: "Invalid loop mode." });
    }

    // Set loop mode
    const success = queue.setRepeatMode(QueueRepeatMode[mode.toUpperCase()]);

    // Check if setting loop mode was successful
    if (!success) {
      // Send error message
      return interaction.reply({ content: "Failed to set loop mode." });
    }
    // Send success message
    return interaction.reply({ content: `Set loop mode to ${mode.toUpperCase()}.` });
  },
};
