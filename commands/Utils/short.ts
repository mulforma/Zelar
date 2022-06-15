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
    const url = interaction.options.getString("url");
    // Deferred reply
    await interaction.deferReply({
      ephemeral: true,
    });

    // Shorten url with x.vvx.bar
<<<<<<< HEAD
    axios
      .post("https://x.vvx.bar/create/url", { url })
      .then(async (res) => {
        // Send response
        await interaction.editReply({
          content: `https://x.vvx.bar/${res.data.short_url}`,
        });
      })
      .catch(async (reason) => {
        // Send error
        await interaction.editReply(`An error occurred while shortening your url.\nReason: ${reason}`);
=======
    axios.post("https://x.vvx.bar/create/url", { url }).then(async (res) => {
      // Send response
      await interaction.editReply({
        content: `${res.data.short_url}`
>>>>>>> 0a7ea2f1413d53ec8102ced3ee6926d8bef6989e
      });
  },
};
