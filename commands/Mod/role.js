// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import Permission from discord.js
const { Permissions } = require("discord.js");

// Export command
module.exports = {
  // Command data
  data: new SlashCommandBuilder()
    // Set name
    .setName("role")
    // Set description
    .setDescription("Give or remove roles from member")
    // Add subcommands
    .addSubcommand((subcommand) =>
      subcommand
        // Set name
        .setName("give")
        // Set description
        .setDescription("Give role to member")
        // Add user option
        .addUserOption((option) =>
          option
            // Set name
            .setName("target")
            // Set description
            .setDescription("Select a member to give role")
            // Set required
            .setRequired(true)
        )
        // Add role option
        .addRoleOption((option) =>
          option
            // Set name
            .setName("role")
            // Set description
            .setDescription("Select a role to give member")
            // Set required
            .setRequired(false)
        )
    )
    // Add subcommands
    .addSubcommand((subcommand) =>
      subcommand
        // Set name
        .setName("remove")
        // Set description
        .setDescription("Remove role from member")
        // Add user option
        .addUserOption((option) =>
          option
            // Set name
            .setName("target")
            // Set description
            .setDescription("Select a member to remove role")
            // Set required
            .setRequired(true)
        )
        // Add role option
        .addRoleOption((option) =>
          option
            // Set name
            .setName("role")
            // Set description
            .setDescription("Select a role to remove from member")
            // Set required
            .setRequired(true)
        )
    ),
  // Command category
  category: "Mod",
  // Command run function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute (client, interaction) {
    // Check if user has permission to use command
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
      // Send error message
      return await interaction.reply({
        content: "You can't use this command because you don't have permission to manage roles.",
        ephemeral: true,
      });
    }
    // Get role and target
    const role = interaction.options.getRole("role");
    const member = interaction.options.getMember("target");
    
    // If subcommand is give
    if (interaction.options.getSubcommand() === "give") {
      // Add role to member
      member.roles.add(role);
      // Send success message
      return await interaction.reply({
        content: `Successfully add role <@&${role.id}> to <@${member.id}> `,
        ephemeral: true,
      });
    }
    // If subcommand option is remove
    else if (interaction.options.getSubcommand() === "remove") {
      // Remove role from member
      member.roles.remove(role);
      // Send success message
      return await interaction.reply({
        content: `Successfully remove role <@&${role.id}> from <@${member.id}> `,
        ephemeral: true,
      });
    }
  },
};
