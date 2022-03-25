// Import SlashCommandBuilder and SlashCommandUserOption
import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
// Import MessageEmbed
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
// Import UserData
import { UserData } from "../../types/UserData";

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("balance")
    // Set command description
    .setDescription("Check your account balance")
    // Add command options
    .addUserOption((option: SlashCommandUserOption) =>
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
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get user
    const user = interaction.options.getUser("target") || interaction.user;
    // Get user balance
    client.db("user")
      .select("coin")
      .where("userId", user.id)
      .andWhere("serverId", <string>interaction.guild!.id)
      .then(async (rows: Array<UserData>) => {
        // Check if user has balance
        if (rows.length === 0) {
          // Send error message
          await interaction.reply(
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
              .setThumbnail(<string>user.avatarURL())
              .addField("💰 Coins", String(rows[0].coin))
              .setFooter({
                text: `Requested by ${interaction.user.username}`,
                iconURL: (<string>interaction.user.avatarURL()),
              }),
          ],
        });
      });
  },
};
