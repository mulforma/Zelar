// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import getPlayerData
const getUserData = require("../../function/getUserData");
// Import getItemData
const getItemData = require("../../function/getItemData");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("sell")
    // Set command description
    .setDescription("Sell an item")
    // Add string option
    .addStringOption((option) =>
      option
        // Set option name
        .setName("item")
        // Set option description
        .setDescription("The item to sell")
        // Set require
        .setRequired(true),
    )
    // Add integer option
    .addIntegerOption((option) =>
      option
        // Set option name
        .setName("amount")
        // Set option description
        .setDescription("The amount of the item to sell")
        // Set require
        .setRequired(true),
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
    // Get item
    const item = interaction.option.getString("item");
    // Get amount
    const amount = interaction.option.getInteger("amount");
    // Get price
    const price = interaction.option.getInteger("price");

    // Get user
    const userData = getUserData(client.db, interaction.user.id, interaction.guild.id);
    // Get items array
    const itemsArr = userData.inventory.items.map((i) => i.name);
    // Check if user has item
    if (!itemsArr.includes(item)) {
      // Send error message
      return interaction.channel.send(`You don't have any ${item} to sell!`);
    }
    // Check if amount is valid
    if (itemsArr[item].amount < amount) {
      // Send error message
      return interaction.channel.send(`You don't have that many ${item} to sell!`);
    }

    // Get market price
    const marketPrice = getItemData(client.db, { itemId: itemsArr[item].id }).price;

    // Remove item amount
    userData.inventory.items[item].amount -= amount;
    // Check if item amount is 0
    if (userData.inventory.items[item].amount === 0) {
      // Remove item
      userData.inventory.items.splice(item, 1);
    }

    // Save user data
    client.db
      .update({ inventory: userData.inventory, coin: (userData.coin + amount) * marketPrice })
      .where("userId", interaction.user.id)
      .where("serverId", interaction.guild.id);

    // Send success message
    interaction.channel.send(
      `You sell ${amount} ${item} in to the player shop for ${price} coins!\n(Type \`/shop player\` to see your shop!)`,
    );
  },
};
