// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import MessageEmbed
const { MessageEmbed } = require("discord.js");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("profile")
    // Set command description
    .setDescription("Set up or view your profile."),
  // Set command category
  category: "Profile",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    // Get user
    const { user } = interaction;
    // Get user profile
    const profile = await client.db
      .select("*")
      .from("user")
      .where("userId", user.id)
      .andWhere("serverId", interaction.guild.id);
    // Check if profile exists
    if (!profile.length) {
      // Create profile
      await client.db("user").insert({
        userId: user.id,
        serverId: interaction.guild.id,
        level: 1,
        xp: 0,
        coin: 0,
        inventory: {
          items: [
            {
              amount: 2,
              description: "Redeem this for 1,000 coins",
              emoji: "<:wumpcoin:889984011865292800>",
              id: 3,
              name: "$2000 Coupon",
              rarity: "Very rare",
              type: "Collectable.Coupon",
              usable: true,
            },
          ],
        },
        timeout: { commands: [], daily: 0, weekly: 0 },
      });
      // Send message
      interaction.reply("Your profile has been created.");
    } else {
      // Send message
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`${user.username}'s profile`)
            .setColor("BLUE")
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .addField("🔼 Levels", profile[0].level)
            .addField("✨ XPs", profile[0].xp)
            .addField("💰 Coins", profile[0].coin)
            .addField("💼 Jobs", profile[0].jobs || "None")
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() }),
        ],
      });
    }
  },
};
