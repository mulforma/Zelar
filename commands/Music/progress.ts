import { SlashCommandBuilder } from "discord.js";
import { Client, ChatInputCommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("progress").setDescription("Show the progress of the current song."),
  category: "Music",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get queue
    const queue = client.player.getQueue(interaction.guild!.id);

    // Check if queue is empty
    if (!queue) {
      // Send error message
      return interaction.reply({
        content: "There is no song playing.",
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
        content: "Can't get the progress of the live stream.",
      });
    }

    // Send progress message
    await interaction.reply({ content: `${progress} (**${timestamp.progress}**%)` });
  },
};
