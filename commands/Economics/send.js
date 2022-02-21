// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import getUserData
const getUserData = require("../../function/getUserData");
// Import checkTimeout
const checkTimeout = require("../../function/checkTimeout");
// Import ms
const ms = require("ms");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("send")
    // Set command description
    .setDescription("Send user an item, Even if they want it or not.")
    // Add user option
    .addUserOption((option) =>
      option
        // Set option name
        .setName("target")
        // Set option description
        .setDescription("The target user you want to send an item")
        // Set option required
        .setRequired(true),
    )
    // Add string option
    .addStringOption((option) =>
      option
        // Set option name
        .setName("item")
        // Set option description
        .setDescription("The item you want to send")
        // Set option required
        .setRequired(true),
    )
    // Add integer option
    .addIntegerOption((option) =>
      option
        // Set option name
        .setName("amount")
        // Set option description
        .setDescription("The amount of the item you want to send")
        // Set option required
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
    // Get target user
    const target = interaction.options.getUser("target");
    // Get item
    const item = interaction.options.getString("item");
    // Get amount
    const amount = interaction.options.getInteger("amount");
    // Check if target is not command author
    if (target.id === interaction.user.id) {
      // Send error message
      interaction.channel.send("You can't send yourself an item, Why would you do that?");
      // Return
      return;
    }

    // Get user data
    const userData = await getUserData(interaction, client.db, interaction.user.id, interaction.guild.id);
    // Get target user data
    const targetData = await getUserData(interaction, client.db, target.id, interaction.guild.id);
    // Find user items
    const userItems = userData.inventory.items.find((x) => x.name === item);
    // Check if user has items
    if (!userItems) {
      // Send error message
      interaction.channel.send(`What are you trying to send ${target.username}? You don't have any ${item}!`);
      // Return
      return;
    }
    // Check if user has enough items
    if (userItems.amount < amount) {
      // Send error message
      interaction.channel.send(`You don't have enough ${item} to send ${amount} to ${target.username}`);
      // Return
      return;
    }

    // Set timeout data to be 1 minutes
    const timeout = ms("1m");

    // Check timeout
    if (checkTimeout(interaction, client.db, "send", timeout, userData)) {
      return;
    }

    // Check if target already has item
    const targetItems = targetData.inventory.items.find((x) => x.name === item);
    // Check if target has item
    if (targetItems) {
      // Add amount to target item
      targetItems.amount += amount;
    } else {
      // Add item to target inventory
      targetData.inventory.items.push({
        name: item,
        amount,
      });
    }
    // Remove amount from user item
    userItems.amount -= amount;
    // Check if user item amount is 0
    if (userItems.amount === 0) {
      // Remove item from user inventory
      userData.inventory.items.splice(userData.inventory.items.indexOf(userItems), 1);
    }
    // Update user data
    await client.db("user").update("inventory", userData.inventory).where({
      userId: interaction.user.id,
      serverId: interaction.guild.id,
    });

    // Update target data
    await client.db("user").update("inventory", targetData.inventory).where({
      userId: target.id,
      serverId: interaction.guild.id,
    });

    // Send success message
    interaction.reply(`Successfully sent ${amount} ${item} to ${target.username}`);
  },
};
