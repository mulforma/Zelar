import { SlashCommandBuilder } from "discord.js";
import { Client, CommandInteraction, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("now-playing").setDescription("Shows the current song playing."),
  category: "Music",
  async execute(client: Client, interaction: CommandInteraction): Promise<any> {
    // Get queue
    const queue = client.player.getQueue(interaction.guild!.id);

    // If queue is empty
    if (!queue) {
      // Send error message
      return interaction.reply({
        content: "There is no song playing.",
      });
    }

    // Loop methods
    const loopMethods = ["None", "Track", "Queue"];

    // Create embed
    const embed = new EmbedBuilder()
      // Set title
      .setTitle(queue.current.title)
      // Set URLs
      .setURL(queue.current.url)
      // Set thumbnail
      .setThumbnail(queue.current.thumbnail)
      // Set description
      .setDescription(`${queue.current.author} - ${queue.current.duration} (Loop ${loopMethods[queue.repeatMode]})`)
      // Set footer
      .setFooter({ text: `Requested by ${queue.current.requestedBy.tag}` });

    // Send embed
    await interaction.reply({ embeds: [embed] });
  },
};
