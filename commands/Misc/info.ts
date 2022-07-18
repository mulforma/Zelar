import { Colors, SlashCommandBuilder } from "discord.js";
import { Client, ChatInputCommandInteraction, GuildMember, EmbedBuilder } from "discord.js";
import ms from "ms";

// Export commands
export default {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Give you information")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("member")
        .setDescription("Give guild member's information")
        .addUserOption((option) => option.setName("target").setDescription("Select a member").setRequired(true)),
    )
    .addSubcommand((subcommand) => subcommand.setName("server").setDescription("Give server's information")),
  category: "Misc",
  // Execute command function
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Function getUserBannerUrl
    async function getUserBannerUrl(userId: string) {
      // Get user from userId
      const user = await client.users.cache.get(userId)!.fetch();
      // Return user banner
      return user.banner
        ? // Check if there is banner, if not, return default image
          `https://cdn.discordapp.com/banners/${userId}/${user.banner}?size=512`
        : "https://i.redd.it/pyeuy7iyfw961.png";
    }

    // If user call subcommand 'member'
    if (interaction.options.getSubcommand() === "member") {
      // Get GuildMember from target user
      const member = <GuildMember>interaction.options.getMember("target")!;
      // Create new embed
      const embed = new EmbedBuilder()
        // Set embed title
        .setTitle(`🙍‍♂️ Member ${member.user.username}`)
        // Add embed fields
        // More about GuildMember, see (https://discord.js.org/#/docs/main/stable/class/GuildMember)
        // More about User, see (https://discord.js.org/#/docs/main/stable/class/User)
        .addFields([
          { name: "💳 Username", value: member.user.username, inline: true },
          { name: "✏ Nickname", value: member.nickname ? member.nickname : "No nickname", inline: true },
          { name: "🆔 UserID", value: member.user.id.toString(), inline: true },
          { name: "#️⃣ Discriminator", value: member.user.discriminator, inline: true },
          {
            name: "🕐 Joined Discord",
            value: `${ms(Date.now() - member.user.createdTimestamp, { long: true })} ago`,
            inline: true,
          },
          {
            name: "👋 Joined Server",
            value: `${ms(Date.now() - member.joinedTimestamp!, { long: true })} ago`,
            inline: true,
          },
        ])
        // Set thumbnail as target user avatar
        .setThumbnail(<string>member.user.avatarURL())
        // Set image as user banner
        .setImage(await getUserBannerUrl(member.user.id.toString()));

      // Reply message with embed
      await interaction.reply({ embeds: [embed] });

      // If user call subcommand 'server'
    } else if (interaction.options.getSubcommand() === "server") {
      // Fetch this server data
      const server = await interaction.guild!;
      // Create EmbedBuilder
      const embed = new EmbedBuilder()
        // Set embed title
        .setTitle(`🚀 Server ${server.name}`)
        // Set embed color
        .setColor(Colors.Blurple)
        // Add embed fields
        // More about Guild, see (https://discord.js.org/#/docs/main/stable/class/Guild)
        .addFields([
          { name: "👋 Server name", value: server.name, inline: true },
          { name: "📃 Server ID", value: server.id.toString(), inline: true },
          { name: "🙍‍♂️ Server Owner", value: `<@${server.ownerId}>`, inline: true },
          { name: "👪 All member", value: `${server.memberCount} members`, inline: true },
          { name: "🚫 NSFW Level", value: server.nsfwLevel.toString(), inline: true },
          { name: "👮‍♀️ Verification level", value: server.verificationLevel.toString(), inline: true },
          { name: "✅ isVerified", value: server.verified.toString(), inline: true },
          { name: "🚨 mfaLevel", value: server.mfaLevel.toString(), inline: true },
        ])
        // Set thumbnail as server icon
        .setThumbnail(<string>server.iconURL());
      // Reply with embed
      await interaction.reply({ embeds: [embed] });
    }
  },
};
