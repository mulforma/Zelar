import { SlashCommandBuilder, SlashCommandUserOption } from "discord.js";
import axios from "axios";
import { Client, ChatInputCommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("magik")
    .setDescription("Magik user avatar")
    .addUserOption((option: SlashCommandUserOption) =>
      option.setName("user").setDescription("The user to get the avatar of").setRequired(false),
    ),
  category: "Fun",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Defer reply
    await interaction.deferReply();
    // Get user
    const user = interaction.options.getUser("user") || interaction.user;
    // Get avatar
    const avatar = user.displayAvatarURL({ size: 512 });
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
