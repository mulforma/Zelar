import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import axios from "axios";

export default {
  data: new SlashCommandBuilder().setName("xkcd").setDescription("Get a random xkcd comic"),
  category: "Fun",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get all possible xkcd comics
    const comics = await axios.get("https://xkcd.com/info.0.json");
    // Get random comic
    const { data } = await axios.get(`https://xkcd.com/${Math.floor(Math.random() * comics.data.num) + 1}/info.0.json`);

    // Create embed
    const embed = new MessageEmbed()
      // Set title
      .setTitle(`#${data.num} - ${data.title}`)
      // Set image
      .setImage(data.img)
      // Set description
      .setDescription(data.alt)
      // Set footer
      .setFooter({ text: `${data.year} - ${data.month}/${data.day}`, iconURL: client.user?.avatarURL()! });
    // Send embed
    await interaction.reply({
      embeds: [embed],
    });
  },
};
