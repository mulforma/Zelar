// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import MessageEmbed
const { MessageEmbed } = require("discord.js");
// Import getItemData
const getItemData = require("../../function/getItemData");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("profile")
    // Set command description
    .setDescription("Set up or view your profile.")
    // Add user option
    .addUserOption((option) =>
      option
        // Set option name
        .setName("target")
        // Set option description
        .setDescription("The target user to view the profile of.")
        // Set option required
        .setRequired(false),
    ),
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
    // Get target
    const target = interaction.options.getUser("target");
    // Get user profile
    const profile = await client.db
      .select("*")
      .from("user")
      .where("userId", (target || user).id)
      .andWhere("serverId", interaction.guild.id);
    // Check if profile exists
    if (!profile.length) {
      if (target) {
        return interaction.reply("This user has not set up a profile yet.");
      }
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
              amount: 1,
              description: "Redeem this for 1,000 coins",
              emoji: "<:wumpcoin:889984011865292800>",
              id: "738262744737972226",
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
      // Get all user items price
      for (const item of profile[0].inventory.items) {
        // Get item data
        const itemData = await getItemData(client.db, "itemId", item.id);
        // If there is no item data
        if (!itemData) {
          // Return
          return;
        }
        // Set item price
        item.price = itemData[0].price || 0;
      }
      // Send message
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`${(target || user).username}'s profile`)
            .setColor("BLUE")
            .setThumbnail((target || user).displayAvatarURL({ dynamic: true }))
            .addField("🔼 Levels", profile[0].level)
            .addField("✨ XPs", profile[0].xp)
            .addField("💰 Coins", profile[0].coin)
            .addField(
              "🤑 Net Worth",
              (
                Number(profile[0].coin) + Number(profile[0].inventory.items.reduce((a, b) => a + Number(b.price), 0))
              ).toString(),
            )
            .addField("💼 Jobs", profile[0].jobs || "None")
            .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() }),
        ],
      });
    }
  },
};
