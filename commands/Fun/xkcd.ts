// Import SlashCommandBuilder
import { SlashCommandBuilder } from "@discordjs/builders";
// Import MessageEmbed
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
// Import axios
import axios from "axios";

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("xkcd")
    // Set command description
    .setDescription("Get a random xkcd comic"),
  // Set command category
  category: "Fun",
  // Execute function
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
