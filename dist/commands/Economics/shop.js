"use strict";
// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import MessageEmbed, MessageButton and MessageActionRow from Discord.js
const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
// Export command
module.exports = {
    // Set command data
    data: new SlashCommandBuilder()
        // Set command name
        .setName("shop")
        // Set command description
        .setDescription("Shows the shop."),
    // Set command category
    category: "Economics",
    // Execute function
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client, interaction) {
        // Get shop
        const shop = await client.db.select("*").from("officialShop");
        // Set items start and end
        let itemsStart = 0;
        let itemsEnd = 5;
        // Add message components
        const arrowButtons = new MessageActionRow().addComponents(
        // Add button
        new MessageButton()
            // Set button id
            .setCustomId("Previous")
            // Set button message
            .setLabel("⬅")
            // Set button style, see more (https://discord.js.org/#/docs/main/stable/typedef/MessageButtonStyle)
            .setStyle("PRIMARY"), 
        // Add button
        new MessageButton()
            // Set button id
            .setCustomId("Next")
            // Set button message
            .setLabel("➡")
            // Set button style, see more (https://discord.js.org/#/docs/main/stable/typedef/MessageButtonStyle)
            .setStyle("PRIMARY"));
        // Create embed
        const embed = new MessageEmbed()
            // Set title
            .setTitle("🛒 Global Market")
            // Set description that show latest 5 items
            .setDescription(shop
            .slice(itemsStart, itemsEnd)
            .map((item) => `${item.itemEmoji} **${item.itemName}** - ${item.itemPrice} coins\n**Item ID** \`${item.itemId}\`\n**Item Type** \`${item.itemType}\`\n**Item Description**: \`${item.itemDescription}\``)
            .join("\n\n"))
            // Set thumbnail
            .setThumbnail(client.user.displayAvatarURL({ format: "png", size: 1024 }))
            // Set footer
            .setFooter({ text: "Use `/buy <item>` to buy an item.", iconURL: client.user.displayAvatarURL() });
        // Send embed
        await interaction.reply({
            embeds: [embed],
            components: [arrowButtons],
        });
        // Filter for answer buttons
        const filter = (i) => 
        // Check if id is Confirm and if it is the same user
        (i.customId === "Next" || i.customId === "Previous") && i.user.id === interaction.user.id;
        // Start message collector
        const collector = interaction.channel.createMessageComponentCollector({
            // Add filter
            filter,
            // Set collector timeout (60 seconds)
            time: 60000,
        });
        // On collector start
        collector.on("collect", async (/** @type {import('discord.js').MessageComponentInteraction}*/ i) => {
            // Defer Update
            await i.deferUpdate();
            // If button id equal to 'Next'
            if (i.customId === "Next") {
                // Check if it has reached the end of the array
                if (itemsEnd >= shop.length) {
                    return;
                }
                // Set items start and end
                itemsStart += 5;
                itemsEnd += 5;
                // Set description
                embed.setDescription(shop
                    .slice(itemsStart, itemsEnd)
                    .map((item) => `${item.itemEmoji} **${item.itemName}** - ${item.itemPrice} coins\n**Item ID** \`${item.itemId}\`\n**Item Type** \`${item.itemType}\`\n**Item Description**: \`${item.itemDescription}\``)
                    .join("\n\n"));
                // Send embed
                await i.editReply({
                    embeds: [embed],
                    components: [arrowButtons],
                });
            }
            else if (i.customId === "Previous") {
                // Check if it has reached the start of the array
                if (itemsStart <= 0) {
                    return;
                }
                // Set items start and end
                itemsStart -= 5;
                itemsEnd -= 5;
                // Set description
                embed.setDescription(shop
                    .slice(itemsStart, itemsEnd)
                    .map((item) => `${item.itemEmoji} **${item.itemName}** - ${item.itemPrice} coins\n**Item ID** \`${item.itemId}\`\n**Item Type** \`${item.itemType}\`\n**Item Description**: \`${item.itemDescription}\``)
                    .join("\n\n"));
                // Send embed
                await i.editReply({
                    embeds: [embed],
                    components: [arrowButtons],
                });
            }
        });
    },
};
