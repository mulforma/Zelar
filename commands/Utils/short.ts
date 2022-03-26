import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";
import axios from "axios";

export default {
  data: new SlashCommandBuilder()
    .setName("short")
    .setDescription("Shorten a url")
    .addStringOption((option) => option.setName("url").setDescription("The url to shorten").setRequired(true)),
  category: "Utils",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get url
    const URL = interaction.options.getString("url");

    // Shorten url with x.vvx.bar
    axios.post("http://x.vvx.bar/create/url", { URL }).then((res) => {
      // Check response status
      if (res.status !== 200) {
        interaction.reply("An error occurred while shortening your url.");
      } else {
        // Send response
        interaction.reply(`${URL} -> ${res.data.short_url}`);
      }
    });
  },
};
