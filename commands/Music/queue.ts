import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("queue").setDescription("Shows the current queue."),
  category: "Music",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get queue
    const queue = client.player.getQueue(interaction.guild!.id);

    // If queue is empty
    if (!queue) {
      // Send error message
      return interaction.reply({
        embeds: [new MessageEmbed().setColor("#ff0000").setDescription("There is no queue.")],
      });
    }

    // If there is no next song
    if (!queue.tracks[0]) {
      // Send error message
      return interaction.reply({
        embeds: [new MessageEmbed().setColor("#ff0000").setDescription("There is no queue after this song.")],
      });
    }

    // Create embed
    const embed = new MessageEmbed()
      .setColor("#00ff00")
      .setTitle("Queue")
      .setDescription(
        `${queue.tracks.map((track, index) => `${index + 1}. [${track.title}](${track.url})`).join("\n")}`,
      )
      .setThumbnail(client.user!.displayAvatarURL());

    // Send embed
    await interaction.reply({ embeds: [embed] });
  },
};
