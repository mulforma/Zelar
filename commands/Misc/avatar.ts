import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get a user's avatar")
    .addUserOption((option) =>
      option.setName("target").setDescription("The user to get the avatar of").setRequired(false),
    ),
  category: "Misc",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get target
    const target = interaction.options.getUser("target") || interaction.user;

    // Send user's avatar
    await interaction.reply({
      embeds: [
        // Set embed
        new MessageEmbed()
          // Set title
          .setTitle(`${target.username}'s avatar`)
          // Set image
          .setImage(
            target.displayAvatarURL({
              format: "png",
              size: 4096,
              dynamic: true,
            }),
          )
          // Set footer
          .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL()! }),
      ],
    });
  },
};
