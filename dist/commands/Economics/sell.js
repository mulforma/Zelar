"use strict";
// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import getPlayerData
const getUserData = require("../../methods/getUserData");
// Import getItemData
const getItemData = require("../../methods/getItemData");
// Export command
module.exports = {
    // Set command data
    data: new SlashCommandBuilder()
        // Set command name
        .setName("sell")
        // Set command description
        .setDescription("Sell an item")
        // Add string option
        .addStringOption((option) => option
        // Set option name
        .setName("item")
        // Set option description
        .setDescription("The item to sell")
        // Set require
        .setRequired(true))
        // Add integer option
        .addIntegerOption((option) => option
        // Set option name
        .setName("amount")
        // Set option description
        .setDescription("The amount of the item to sell")
        // Set require
        .setRequired(true)),
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
        const item = interaction.options.getString("item");
        // Get amount
        const amount = interaction.options.getInteger("amount");
        // Get user
        const userData = await getUserData(interaction, client.db, interaction.user.id, interaction.guild.id);
        // Get items array
        const itemsArr = userData.inventory.items.map((i) => i.name);
        // Check if user has item
        if (!itemsArr.includes(item)) {
            // Send error message
            return interaction.reply(`You don't have any ${item} to sell!`);
        }
        // Get items as json
        const itemsJson = userData.inventory.items.find((i) => i.name === item);
        // Check if amount is valid
        if (itemsJson.amount < amount) {
            // Send error message
            return interaction.reply(`You don't have that many ${item} to sell!`);
        }
        // Get market price
        const marketPrice = await getItemData(client.db, "itemId", itemsJson.id);
        // Check if market has item
        if (!marketPrice.price) {
            return interaction.reply(`The market doesn't have any ${item}!`);
        }
        // Get item index
        const itemIndex = userData.inventory.items.findIndex((i) => i.name === item);
        // Remove item amount
        userData.inventory.items[itemIndex].amount -= amount;
        // Check if item amount is 0
        if (userData.inventory.items[itemIndex].amount === 0) {
            // Remove item
            userData.inventory.items.splice(item, 1);
        }
        // Update inventory anc calculate new balance
        client
            .db("user")
            .update({
            inventory: JSON.stringify(userData.inventory),
            coin: Number(userData.coin) + amount * Number(marketPrice.price),
        })
            .where({
            userId: interaction.user.id,
            serverId: interaction.guild.id,
        })
            .then(() => {
            // Send success message
            interaction.reply(`You sold ${amount} ${item} for ${amount * marketPrice.price} coins!`);
        });
    },
};
