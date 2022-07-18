import { Colors, SlashCommandBuilder, SlashCommandUserOption } from "discord.js";
import { Client, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { getCoin } from "../../methods/getCoin.js";

export default {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your account balance")
    .addUserOption((option: SlashCommandUserOption) =>
      option.setName("target").setDescription("Select a user to check their balance").setRequired(false),
    ),
  category: "Economics",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get user
    const user = interaction.options.getUser("target") || interaction.user;
    // Get user balance
    const coin = await getCoin(interaction, user.id, interaction.guild!.id);
    // Check if user has balance
    if (!coin) {
      // Send error message
      await interaction.reply(`Oops! \`${user.username}\` has no coin!`);
      // Return
      return;
    }
    // Send balance message
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(Colors.Aqua)
          .setTitle(`${user.username}'s balance`)
          .setColor(Colors.Blue)
          .setThumbnail(<string>user.avatarURL())
          .addFields([{ name: "💰 Coins", value: String(coin) }])
          .setFooter({
            text: `Requested by ${interaction.user.username}`,
            iconURL: <string>interaction.user.avatarURL(),
          }),
      ],
    });
  },
};
