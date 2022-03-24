// Import SlashCommandBuilder
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
// Import axios
import axios from "axios";
// Import Client and CommandInteraction
import { Client, CommandInteraction } from "discord.js";

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("magik")
    // Set command description
    .setDescription("Magik user avatar")
    // Add user option
    .addUserOption((option: SlashCommandUserOption) =>
      option
        // Set option name
        .setName("user")
        // Set option description
        .setDescription("The user to get the avatar of")
        // Set option required
        .setRequired(false),
    ),
  // Set command category
  category: "Image",
  // Execute function
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Defer reply
    await interaction.deferReply();
    // Get user
    const user = interaction.options.getUser("user") || interaction.user;
    // Get avatar
    const avatar = user.displayAvatarURL({ format: "png", size: 512 });
    // GET request to nekobot api yet we are lazy to do it ourselves
    // TODO: Instead of using other's api, we should use our own technique. This will improve performance much better.
    const { data } = await axios.get(`https://nekobot.xyz/api/imagegen?type=magik&image=${avatar}&intensity=1`);
    // Send image
    await interaction.editReply({
      files: [
        {
          attachment: data.message,
          name: "magik.png",
        },
      ],
    });
  },
};
