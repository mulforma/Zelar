import { SlashCommandBuilder } from "discord.js";
import { Client, CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("resume").setDescription("Resume the current song."),
  category: "Music",
  async execute(client: Client, interaction: CommandInteraction): Promise<any> {
    // Get queue
    const queue = client.player.getQueue(interaction.guild!.id);

    // Check if queue is empty
    if (!queue) {
      // Send error message
      return interaction.reply({
        content: "There is no song playing.",
      });
    }

    // Pause queue
    const success = queue.setPaused(false);

    // Check if queue was paused
    if (success) {
      // Send success message
      return interaction.reply({
        content: "The song has been resumed.",
      });
    }
    return interaction.reply({
      content: "There was an error resuming the song.",
    });
  },
};
