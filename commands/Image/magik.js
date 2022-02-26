// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import axios
const axios = require("axios");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("magik")
    // Set command description
    .setDescription("Magik user avatar")
    // Add user option
    .addUserOption((option) =>
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
  /**
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    // Defer reply
    interaction.deferReply();
    // Get user
    const user = interaction.options.getUser("user") || interaction.user;
    // Get avatar
    const avatar = user.displayAvatarURL({ format: "png", size: 512 });
    // GET request to nekobot api yet we are lazy to do it ourselves
    // TODO: Instead of using other's api, we should use our own technique. This will improve performance much better.
    const { data } = await axios.get(
      `https://nekobot.xyz/api/imagegen?type=magik&image=${avatar}&intensity=1`,
    );
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
