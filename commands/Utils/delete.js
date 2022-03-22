// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import Permissions from discord.js
const { Permissions } = require("discord.js");

// Export command
export default {
  // Command data
  data: new SlashCommandBuilder()
    // Command name
    .setName("delete")
    // Command description
    .setDescription("Delete message within 2 weeks old")
    // Add number option
    .addNumberOption((option) =>
      option
        // Set option name
        .setName("amount")
        // Set option description
        .setDescription("Amount of message to  delete, limit 100 message")
        // Set option is required
        .setRequired(true),
    ),
  // Command category
  category: "Utils",
  // Command run function
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Check if user has permission to use command
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      // Send error message
      return interaction.reply({
        content: "You can't use this command because you don't have permission to manage message.",
        ephemeral: true,
      });
    }
    // Get amount from option
    const amount = interaction.options.getNumber("amount");

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
    await interaction.channel.bulkDelete(amount).then(async () => {
      // Send success message
      await interaction.reply({
        content: `Successfully deleted ${amount} messages`,
        ephemeral: true,
      });
    });
  },
};
