// Import SlashCommandBuilder
import { SlashCommandBuilder } from "@discordjs/builders";
// Import axios
import axios from "axios";
// Import MessageEmbed
import { Client, CommandInteraction, MessageEmbed, TextChannel } from "discord.js";

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("rule34")
    // Set command description
    .setDescription("Search rule34!")
    // Add string option
    .addStringOption((option) =>
      option
        // Set option name
        .setName("tag")
        // Set option description
        .setDescription("The tag to search for (Separate with commas)")
        // Set option required
        .setRequired(false),
    ),
  // Set command category
  category: "Nsfw",
  // Execute function
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
    const tags = <Array<string> | string>(interaction.options.getString("tag")
      ? // If tag is undefined
        interaction.options.getString("tag")!.split(",").join("+")
      : // Else
        "");

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
