// Import SlashCommandBuilder
import { SlashCommandBuilder } from "@discordjs/builders";
// Import MessageEmbed
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
// Import DIG
import DIG from "discord-image-generation";

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("triggered")
    // Set command description
    .setDescription("Generates a triggered image.")
    // Add user option
    .addUserOption((option) =>
      option
        // Set option name
        .setName("user")
        // Set option description
        .setDescription("The user to generate the triggered image for.")
        // Set option required
        .setRequired(false),
    ),
  // Set command category
  category: "Misc",
  // Execute function
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