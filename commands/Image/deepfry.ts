// Import SlashCommandBuilder
import { SlashCommandBuilder } from "@discordjs/builders";
// Import axios
import axios from "axios";
// Import Client and CommandInteraction
import { Client, CommandInteraction } from "discord.js";

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("deepfry")
    // Set command description
    .setDescription("Deepfries an image")
    // Add user option
    .addUserOption((option) =>
      option
        // Set option name
        .setName("user")
        // Set option description
        .setDescription("The user to deepfry")
        // Set option required
        .setRequired(false),
    ),
  // Set command category
  category: "Misc",
  // Execute function
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
