// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import MessageEmbed
const { MessageEmbed } = require("discord.js");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("balance")
    // Set command description
    .setDescription("Check your account balance")
    // Add command options
    .addUserOption((option) =>
      option
        // Set option name
        .setName("target")
        // Set option description
        .setDescription("Select a user to check their balance")
        // Set if option is required
        .setRequired(false),
    ),
  // Set command category
  category: "Economics",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    // Get user
    const user = interaction.options.getUser("target") || interaction.user;
    // Get user balance
    client.db
      .select("coin")
      .from("user")
      .where("userId", user.id)
      .andWhere("serverId", interaction.guild.id)
      .then(async (rows) => {
        // Check if user has balance
        if (rows.length === 0) {
          // Send error message
          interaction.reply(
            `Oops! \`${user.username}\`'s profile is not set up yet.\nPlease use \`/profile\` to set up profile.`,
          );
          // Return
          return;
        }
        // Send balance message
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#0099ff")
              .setTitle(`${user.username}'s balance`)
              .setColor("BLUE")
              .setThumbnail(user.avatarURL())
              .addField("💰 Coins", rows[0].coin)
              .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() }),
          ],
        });
      });
  },
};
