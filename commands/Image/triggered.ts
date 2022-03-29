import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import DIG from "discord-image-generation";

export default {
  data: new SlashCommandBuilder()
    .setName("triggered")
    .setDescription("Generates a triggered image.")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to generate the triggered image for.").setRequired(false),
    ),
  category: "Image",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get user
    const user = interaction.options.getUser("user") || interaction.user;
    // Generate triggered image
    const triggered = await new DIG.Triggered().getImage(user.displayAvatarURL({ format: "png", size: 512 }));
    // Send triggered image
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          // Set title
          .setTitle(user.username)
          // Set triggered image
          .setImage("attachment://triggered.gif")
          // Set triggered image footer
          .setFooter({
            text: `Requested by ${user.tag}`,
            iconURL: user.displayAvatarURL({ format: "png", size: 512 }),
          }),
      ],
      files: [
        {
          attachment: triggered,
          name: "triggered.gif",
        },
      ],
    });
  },
};
