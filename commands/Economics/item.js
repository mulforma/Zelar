// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import getItemData
const getItemData = require("../../function/getItemData");
// Import MessageEmbed
const { MessageEmbed } = require("discord.js");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("item")
    // Set command description
    .setDescription("Get information about an item.")
    // Add string option
    .addStringOption(option =>
      option
        // Set option name
        .setName("item")
        // Set option description
        .setDescription("The name of the item.")
        // Set option required
        .setRequired(true)
    ),
  // Set command category
  category: "Economics",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute (client, interaction) {
    // Get item name
    const itemName = interaction.options.getString("item");
    // Get item data
    const itemData = await getItemData(client.db, "itemName", itemName);
    // Check if item data is empty array
    if (itemData.length === 0) {
      // Send error message
      interaction.reply("Item not found.");
      // Return
      return;
    }
    // Create embed
    const embed = new MessageEmbed()
      // Set title
      .setTitle(`${itemData[0].itemEmoji} ${itemData[0].itemName}`)
      // Set Thumbnail
      .setThumbnail(client.user.displayAvatarURL())
      // Add field
      .addField("Description", itemData[0].itemDescription, true)
      .addField("ID", itemData[0].itemId, true)
      .addField("Type", itemData[0].itemType, true)
      .addField("Rarity", itemData[0].itemRarity, true)
      .addField("Price", itemData[0].price, true)
      .addField("Icon", itemData[0].itemEmoji, true)
      .addField("Usable?", itemData[0].usable.toString(), true)
      .addField("Sellable?", itemData[0].sellable.toString(), true)
      // Set color
      .setColor("BLUE");
    // Send embed
    interaction.reply({ embeds: [embed] });
  },
};