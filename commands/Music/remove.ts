import { SlashCommandBuilder } from "discord.js";
import { Client, ChatInputCommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove the song from the queue.")
    .addNumberOption((option) =>
      option.setName("track-number").setDescription("The track number to remove.").setRequired(true),
    ),
  category: "Music",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get queue
    const queue = client.player.getQueue(interaction.guild!.id);
    // Get track number
    const trackNumber = interaction.options.getNumber("track-number")! - 1;

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
