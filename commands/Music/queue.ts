import { SlashCommandBuilder } from "discord.js";
import { Client, CommandInteraction, EmbedBuilder } from "discord.js";
import { Track } from "discord-player";

export default {
  data: new SlashCommandBuilder().setName("queue").setDescription("Shows the current queue."),
  category: "Music",
  async execute(client: Client, interaction: CommandInteraction): Promise<any> {
    // Get queue
    const queue = client.player.getQueue(interaction.guild!.id);

    // If queue is empty
    if (!queue) {
      // Send error message
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor("#ff0000").setDescription("There is no queue.")],
      });
    }

    // If there is no next song
    if (!queue.tracks[0]) {
      // Send error message
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor("#ff0000").setDescription("There is no queue after this song.")],
      });
    }

    // Create embed
    const embed = new EmbedBuilder()
      .setColor("#00ff00")
      .setTitle("Queue")
      .setDescription(
        `${queue.tracks
          .map((track: Track, index: number) => `${index + 1}. [${track.title}](${track.url})`)
          .join("\n")}`,
      )
      .setThumbnail(client.user!.displayAvatarURL());

    // Send embed
    await interaction.reply({ embeds: [embed] });
  },
};
