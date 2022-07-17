import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { Client, CommandInteraction, MessageEmbed, TextChannel } from "discord.js";

// Set rating
const rating = {
  e: "explicit",
  s: "safe",
  q: "questionable",
  u: "unknown",
};

export default {
  data: new SlashCommandBuilder()
    .setName("danbooru")
    .setDescription("Search danbooru!")
    .addStringOption((option) =>
      option.setName("tag").setDescription("The tag to search for (Separate with commas)").setRequired(false),
    ),
  category: "Nsfw",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Check if channel is NSFW
    if (!(<TextChannel>interaction.channel!).nsfw) {
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
    axios.get(`https://danbooru.donmai.us/posts.json?tags=${tags ? tags : ""}&page=${page}&limit=1`).then((res) => {
      // Send image
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`Image from ${res.data[0].tag_string_artist}`)
            .setImage(res.data[0].file_url)
            .setColor("GREEN")
            .setURL(`https://danbooru.donmai.us/posts/${res.data[0].id}`)
            .setFooter({
              text: `rating: ${rating[res.data[0].rating as keyof typeof rating]} | score: ${res.data[0].score}`,
            }),
        ],
      });
    });
  },
};
