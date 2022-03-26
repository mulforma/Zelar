import { SlashCommandBuilder, SlashCommandUserOption } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { UserData } from "../../types/UserData";

export default {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your account balance")
    .addUserOption((option: SlashCommandUserOption) =>
      option.setName("target").setDescription("Select a user to check their balance").setRequired(false),
    ),
  category: "Economics",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get user
    const user = interaction.options.getUser("target") || interaction.user;
    // Get user balance
    client
      .db("user")
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
                iconURL: <string>interaction.user.avatarURL(),
              }),
          ],
        });
      });
  },
};
