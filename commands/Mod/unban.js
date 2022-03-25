// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import Permission from discord.js
const { Permissions } = require("discord.js");

// Export command
export default {
  // Command data
  data: new SlashCommandBuilder()
    // Command name
    .setName("unban")
    // Command description
    .setDescription("Unban a user")
    // Command Option
    .addStringOption((option) =>
      option
        // Option name
        .setName("id")
        // Option description
        .setDescription("Select a user to unban")
        // Option required
        .setRequired(true),
    ),
  // Command category
  category: "Mod",
  // Command run function
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Check if user has permission to ban members
    if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
      // Send error message
      return interaction.reply({
        content: "You can't unban member because you have no permissions to ban.",
        ephemeral: true,
      });
    }

    // Get user to unban
    const id = await interaction.options.get("id");

    // Unban user
    await interaction.guild.members.unban(id?.value);
    // Send success message
    await interaction.reply(`Successfully unban <@${id?.value}>`);
  },
};
