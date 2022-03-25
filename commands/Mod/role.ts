// Import SlashCommandBuilder
import { SlashCommandBuilder } from "@discordjs/builders";
// Import Permission from discord.js
import {
  Client,
  CommandInteraction,
  GuildMember,
  GuildMemberRoleManager,
  Permissions,
} from "discord.js";

// Export command
export default {
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
            .setRequired(true),
        )
        // Add role option
        .addRoleOption((option) =>
          option
            // Set name
            .setName("role")
            // Set description
            .setDescription("Select a role to give member")
            // Set required
            .setRequired(false),
        ),
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
            .setRequired(true),
        )
        // Add role option
        .addRoleOption((option) =>
          option
            // Set name
            .setName("role")
            // Set description
            .setDescription("Select a role to remove from member")
            // Set required
            .setRequired(true),
        ),
    ),
  // Command category
  category: "Mod",
  // Command run function
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Check if user has permission to use command
    if (!(interaction.member!.permissions as Readonly<Permissions>).has(Permissions.FLAGS.MANAGE_ROLES)) {
      // Send error message
      return interaction.reply({
        content: "You can't use this command because you don't have permission to manage roles.",
        ephemeral: true,
      });
    }
    // Get role and target
    const role = interaction.options.getRole("role")!;
    const member = <GuildMember>interaction.options.getMember("target")!;

    // If subcommand is give
    if (interaction.options.getSubcommand() === "give") {
      // Add role to member
      await (member.roles as GuildMemberRoleManager).add(role.id);
      // Send success message
      return interaction.reply({
        content: `Successfully add role <@&${role.id}> to <@${member.id}> `,
        ephemeral: true,
      });
    }
    // If subcommand option is remove
    else if (interaction.options.getSubcommand() === "remove") {
      // Remove role from member
      await member.roles.remove(role.id);
      // Send success message
      return interaction.reply({
        content: `Successfully remove role <@&${role.id}> from <@${member.id}> `,
        ephemeral: true,
      });
    }
  },
};
