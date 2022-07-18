import { SlashCommandBuilder } from "discord.js";
import { QueueRepeatMode } from "discord-player";
import { Client, ChatInputCommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Loop the current song.")
    .addStringOption((option) =>
      option.setName("mode").setDescription("Loop mode. (Off, Track and Queue)").setRequired(true),
    ),
  category: "Music",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get queue
    const queue = client.player.getQueue(interaction.guild!.id);

    // Check if queue is not playing
    if (!queue) {
      // Send error message
      return interaction.reply({ content: "There is no song playing." });
    }

    // Get mode
    const mode = interaction.options.getString("mode")!;

    if (!["off", "track", "queue"].includes(mode.toLowerCase())) {
      // Send error message
      return interaction.reply({ content: "Invalid loop mode." });
    }

    // Set loop mode
    const success = queue.setRepeatMode(QueueRepeatMode[mode.toUpperCase() as keyof typeof QueueRepeatMode]);

    // Check if setting loop mode was successful
    if (!success) {
      // Send error message
      return interaction.reply({ content: "Failed to set loop mode." });
    }
    // Send success message
    return interaction.reply({ content: `Set loop mode to ${mode.toUpperCase()}.` });
  },
};
