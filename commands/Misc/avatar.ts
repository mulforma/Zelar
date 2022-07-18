import { SlashCommandBuilder } from "discord.js";
import { Client, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get a user's avatar")
    .addUserOption((option) =>
      option.setName("target").setDescription("The user to get the avatar of").setRequired(false),
    ),
  category: "Misc",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get target
    const target = interaction.options.getUser("target") || interaction.user;

    // Send user's avatar
    await interaction.reply({
      embeds: [
        // Set embed
        new EmbedBuilder()
          // Set title
          .setTitle(`${target.username}'s avatar`)
          // Set image
          .setImage(
            target.displayAvatarURL({
              size: 4096,
            }),
          )
          // Set footer
          .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL()! }),
      ],
    });
  },
};
