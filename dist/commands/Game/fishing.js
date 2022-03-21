"use strict";
// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import ms
const ms = require("ms");
// Import getUserData
const getUserData = require("../../methods/getUserData");
// Import checkTimeout
const checkTimeout = require("../../methods/checkTimeout");
// Export command
module.exports = {
    // Set command data
    data: new SlashCommandBuilder()
        // Set command name
        .setName("fishing")
        // Set command description
        .setDescription("Go fishing!"),
    // Set command category
    category: "Game",
    // Execute function
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client, interaction) {
        // Get user
        const userData = await getUserData(interaction, client.db, interaction.user.id, interaction.guild.id);
        // Set timeout data to be 2 minutes
        const timeout = ms("2m");
        // Check if user is in timeout
        if (await checkTimeout(interaction, client.db, "fishing", timeout, userData)) {
            return;
        }
        // 45% Chance of getting a fish if has fishing rod, 15% chance if no fishing rod
        if (Math.floor(Math.random() * 100) <=
            (userData.inventory.items.findIndex((i) => i.name === "Fishing Rod") === -1 ? 45 : 15)) {
            // Get random fish
            const fish = await client.db
                .select("*")
                .from("globalItems")
                .where("itemType", "Collectable.Fish")
                .orderByRaw("RANDOM()");
            // Send message
            interaction.reply(`🎉 You caught a ${fish[0].itemName}!`);
            // Check if user has this fish in inventory, If yes, add 1 to amount
            if (userData.inventory.items.findIndex((i) => i.id === fish[0].id) !== -1) {
                // Add 1 to amount
                userData.inventory.items[userData.inventory.items.findIndex((i) => i.id === fish[0].id)].amount += 1;
            }
            else {
                // Add fish to inventory
                userData.inventory.items.push({
                    id: fish[0].id,
                    amount: 1,
                    name: fish[0].itemName,
                    type: fish[0].itemType,
                    description: fish[0].itemDescription,
                    emoji: fish[0].itemEmoji,
                    rarity: fish[0].itemRarity,
                    usable: fish[0].usable,
                });
            }
            // Save user data
            await client
                .db("user")
                .update("inventory", userData.inventory)
                .where("userId", interaction.user.id)
                .andWhere("serverId", interaction.guild.id);
        }
        else {
            // Send message
            interaction.reply(`😢 You didn't catch anything.${userData.inventory.items.findIndex((i) => i.name === "Fishing Rod") === -1
                ? "\nYou can buy a fishing rod to increase your chance of catching a fish."
                : ""}`);
        }
    },
};
