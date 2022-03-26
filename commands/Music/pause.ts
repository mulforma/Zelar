import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the current song."),
  category: "Music",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
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
