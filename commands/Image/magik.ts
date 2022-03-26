import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import axios from "axios";
import { Client, CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("magik")
    .setDescription("Magik user avatar")
    .addUserOption((option: SlashCommandUserOption) =>
      option.setName("user").setDescription("The user to get the avatar of").setRequired(false),
    ),
  category: "Image",
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
