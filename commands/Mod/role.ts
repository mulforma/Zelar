import { SlashCommandBuilder } from "@discordjs/builders";

import { Client, CommandInteraction, GuildMember, GuildMemberRoleManager, Permissions } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Give or remove roles from member")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("give")
        .setDescription("Give role to member")
        .addUserOption((option) =>
          option.setName("target").setDescription("Select a member to give role").setRequired(true),
        )
        .addRoleOption((option) =>
          option.setName("role").setDescription("Select a role to give member").setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove role from member")
        .addUserOption((option) =>
          option.setName("target").setDescription("Select a member to remove role").setRequired(true),
        )
        .addRoleOption((option) =>
          option.setName("role").setDescription("Select a role to remove from member").setRequired(true),
        ),
    ),
  category: "Mod",
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
