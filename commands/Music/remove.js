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
    .addNumberOption((option) =>
      option
        // Set option name
        .setName("track-number")
        // Set option description
        .setDescription("The track number to remove.")
        // Set option required
        .setRequired(true),
    ),
  // Set command category
  category: "Music",
  // Execute function
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get queue
    const queue = client.player.getQueue(interaction.guild.id);
    // Get track number
    const trackNumber = interaction.options.getNumber("track-number") - 1;

    // Check if queue is empty
    if (!queue) {
      // Send error message
      return interaction.reply({
        content: "There is no song playing.",
      });
    }

    // Remove song
    const success = queue.remove(trackNumber);

    // Check if skip was successful
    if (success) {
      // Send success message
      return interaction.reply({
        content: "Song removed.",
      });
    }
    // Send error message
    return interaction.reply({
      content: "Something went wrong...",
    });
  },
};
