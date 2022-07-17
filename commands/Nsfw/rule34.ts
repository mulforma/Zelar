import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { Client, CommandInteraction, MessageEmbed, TextChannel } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("rule34")
    .setDescription("Search rule34!")
    .addStringOption((option) =>
      option.setName("tag").setDescription("The tag to search for (Separate with commas)").setRequired(false),
    ),
  category: "Nsfw",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Check if channel is NSFW
    if (!(<TextChannel>interaction.channel)!.nsfw) {
      // Send error message
      await interaction.reply({
        embeds: [new MessageEmbed().setColor("#ff0000").setDescription("This channel is not NSFW")],
      });
      // Return
      return;
    }

    // Get tags
    const tags = <Array<string> | null>(interaction.options.getString("tag")
      ? // If tag is undefined
        interaction.options.getString("tag")!.split(",").join("+")
      : // Else
        null);

    // Fetch random image
    const { data } = await axios.get(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${tags}&json=1`);

    // Get random image
    const image = data[Math.floor(Math.random() * data.length)];

    // Send image
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`Image from ${image.owner}`)
          .setColor("#ffb6c1")
          .setImage(image.file_url)
          .setFooter({ text: `rating: ${image.rating} | score: ${image.score}` })
          .setURL(`https://gelbooru.com/index.php?page=post&s=view&id=${image.id}`),
      ],
    });
  },
};
