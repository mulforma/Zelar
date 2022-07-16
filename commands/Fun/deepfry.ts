import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { Client, CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("deepfry")
    .setDescription("Deepfries an image")
    .addUserOption((option) => option.setName("user").setDescription("The user to deepfry").setRequired(false)),
  category: "Fun",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Defer reply
    await interaction.deferReply();
    // Get user
    const user = interaction.options.getUser("user") || interaction.user;
    // Get user avatar
    const avatar = user.displayAvatarURL({ format: "png", size: 512 });
    // GET request to nekobot api
    // TODO: Instead of using the nekobot api, we just do it ourselves. Because this will affect the bots performance
    const { data } = await axios.get(`https://nekobot.xyz/api/imagegen?type=deepfry&image=${avatar}`);
    // Send deepfry avatar
    await interaction.editReply({
      files: [
        {
          attachment: data.message,
          name: "deepfry.png",
        },
      ],
    });
  },
};
