import { SlashCommandBuilder } from "discord.js";
import { Client, ChatInputCommandInteraction, PermissionsBitField, TextChannel } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Delete message within 2 weeks old")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of message to  delete, limit 100 message")
        // Set option is required
        .setRequired(true),
    ),
  category: "Mod",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Check if user has permission to use command
    if (
      !(interaction.member?.permissions as Readonly<PermissionsBitField>).has(PermissionsBitField.Flags.ManageMessages)
    ) {
      // Send error message
      return interaction.reply({
        content: "You can't use this command because you don't have permission to manage message.",
        ephemeral: true,
      });
    }
    // Get amount from option
    const amount = interaction.options.getNumber("amount") ?? 1;

    // Check if amount is more than 100
    if (amount > 100) {
      // Send error message
      return interaction.reply({
        content: "Amount must not be higher than 100.",
        ephemeral: true,
      });
    }
    // If amount is less than or equal to 0
    else if (amount <= 0) {
      // Send error message
      return interaction.reply({
        content: "Amount must not be equal to or less than zero.",
        ephemeral: true,
      });
    }

    // Delete message
    await (interaction.channel as TextChannel)?.bulkDelete(amount).then(async () => {
      // Send success message
      await interaction.reply({
        content: `Successfully deleted ${amount} messages`,
        ephemeral: true,
      });
    });
  },
};
