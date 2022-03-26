import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
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
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
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
      const embed = new MessageEmbed()
        // Set embed title
        .setTitle(`🙍‍♂️ Member ${member.user.username}`)
        // Set embed color
        .setColor("RANDOM")
        // Add embed fields
        // More about GuildMember, see (https://discord.js.org/#/docs/main/stable/class/GuildMember)
        // More about User, see (https://discord.js.org/#/docs/main/stable/class/User)
        .addField("💳 Username", member.user.username, true)
        .addField("✏ Nickname", member.nickname ? member.nickname : "No nickname", true)
        .addField("🆔 UserID", member.user.id.toString(), true)
        .addField("#️⃣ Discriminator", member.user.discriminator, true)
        .addField("🕐 Joined Discord", `${ms(Date.now() - member.user.createdTimestamp, { long: true })} ago`, true)
        .addField("👋 Joined Server", `${ms(Date.now() - member.joinedTimestamp!, { long: true })} ago`, true)
        // Set thumbnail as target user avatar
        .setThumbnail(<string>member.user.avatarURL({ dynamic: false }))
        // Set image as user banner
        .setImage(await getUserBannerUrl(member.user.id.toString()));

      // Reply message with embed
      await interaction.reply({ embeds: [embed] });

      // If user call subcommand 'server'
    } else if (interaction.options.getSubcommand() === "server") {
      // Fetch this server data
      const server = await interaction.guild!;
      // Create MessageEmbed
      const embed = new MessageEmbed()
        // Set embed title
        .setTitle(`🚀 Server ${server.name}`)
        // Set embed color
        .setColor("RANDOM")
        // Add embed fields
        // More about Guild, see (https://discord.js.org/#/docs/main/stable/class/Guild)
        .addField("👋 Server name", server.name, true)
        .addField("📃 Server ID", server.id.toString(), true)
        .addField("🙍‍♂️ Server Owner", `<@${server.ownerId}>`, true)
        .addField("👪 All member", `${server.memberCount} members`, true)
        .addField("🚫 NSFW Level", server.nsfwLevel, true)
        .addField("👮‍♀️ Verification level", server.verificationLevel, true)
        .addField("✅ isVerified", server.verified.toString(), true)
        .addField("🚨 mfaLevel", server.mfaLevel, true)
        // Set thumbnail as server icon
        .setThumbnail(<string>server.iconURL());
      // Reply with embed
      await interaction.reply({ embeds: [embed] });
    }
  },
};
