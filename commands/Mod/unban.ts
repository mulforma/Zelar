import { SlashCommandBuilder } from "discord.js";
import { Client, ChatInputCommandInteraction, PermissionsBitField, UserResolvable } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user")
    .addStringOption((option) => option.setName("id").setDescription("Select a user to unban").setRequired(true)),
  category: "Mod",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Check if user has permission to ban members
    if (!(interaction.member!.permissions as Readonly<PermissionsBitField>).has(PermissionsBitField.Flags.BanMembers)) {
      // Send error message
      return interaction.reply({
        content: "You can't unban member because you have no permissions to ban.",
        ephemeral: true,
      });
    }

    // Get user to unban
    const id = await interaction.options.get("id")!;

    // Unban user
    await interaction.guild!.members.unban(<UserResolvable>id.value);
    // Send success message
    await interaction.reply(`Successfully unban <@${id?.value}>`);
  },
};
