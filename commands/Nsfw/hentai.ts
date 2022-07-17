import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { Client, CommandInteraction, MessageEmbed, TextChannel } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("hentai")
    .setDescription("Sends a random hentai image (from gelbooru)")
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

    // Get random page
    const page = Math.floor(Math.random() * 100) + 1;

    // Get random image
    const image = await axios.get(
      `https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1&limit=1&pid=${page}${
        tags ? `&tags=${(<Array<string>>tags).join("+")}` : ""
      }`,
    );

    // If no image
    if (!image.data.post[0]) {
      // Send error message
      await interaction.reply({
        embeds: [new MessageEmbed().setColor("#ff0000").setDescription("No image found")],
      });
      return;
    }

    // Send image
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`Image from ${image.data.post[0].owner}`)
          .setColor("#ffb6c1")
          .setImage(image.data.post[0].file_url)
          .setFooter({ text: `rating: ${image.data.post[0].rating} | score: ${image.data.post[0].score}` })
          .setURL(`https://gelbooru.com/index.php?page=post&s=view&id=${image.data.post[0].id}`),
      ],
    });
  },
};
