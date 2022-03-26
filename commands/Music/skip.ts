import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("skip").setDescription("Skips the current song."),
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

    // Skip song
    const success = queue.skip();

    // Check if skip was successful
    if (success) {
      // Send success message
      return interaction.reply({
        content: "Skipped the current song.",
      });
    }
    // Send error message
    return interaction.reply({
      content: "Something went wrong...",
    });
  },
};
