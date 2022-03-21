"use strict";
// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import MessageActionRow and MessageButton from discord.js
const { MessageActionRow, MessageButton } = require("discord.js");
// Import function 'addCoin'
const addCoin = require("../../methods/addCoin");
// Export command
module.exports = {
    // Set command data
    data: new SlashCommandBuilder()
        // Set command name
        .setName("rps")
        // Set command description
        .setDescription("Play rock paper scissors with the bot."),
    // Set command category
    category: "Game",
    // Execute function
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client, interaction) {
        // Set variables
        const rps = ["rock", "paper", "scissors"];
        // Set random coin amount
        const randCoin = Math.floor(Math.random() * 15) + 1;
        // Set button
        const rpsButton = new MessageActionRow().addComponents(new MessageButton().setCustomId("rock").setLabel("✊").setStyle("PRIMARY"), new MessageButton().setCustomId("paper").setLabel("✋").setStyle("PRIMARY"), new MessageButton().setCustomId("scissors").setLabel("✌").setStyle("PRIMARY"));
        // RPS result
        const result = rps[Math.floor(Math.random() * rps.length)];
        // Filter for input
        const filter = (i) => i.customId === "rock" ||
            i.customId === "paper" ||
            (i.customId === "scissors" && i.user.id === interaction.user.id);
        // Listen for input
        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 10000,
        });
        // Reply
        await interaction.reply({
            content: "Choose rock, paper, or scissors!",
            components: [rpsButton],
        });
        // On input
        collector.on("collect", async (i) => {
            await i.deferUpdate();
            // Check the result
            if (result === i.customId) {
                // Reply
                await interaction.editReply({
                    content: `[🧑] You choose **${i.customId}**\n[🤖] I choose **${result}**\nResult : **You tied!**`,
                    components: [],
                });
            }
            else if ((i.customId === "rock" && result === "scissors") ||
                (i.customId === "paper" && result === "rock") ||
                (i.customId === "scissors" && result === "paper")) {
                // Reply
                await interaction.editReply({
                    content: `[🧑] You choose **${i.customId}**\n[🤖] I choose **${result}**\nResult : **You win!**\nYou won **${randCoin} coins!**`,
                    components: [],
                });
                // Add coins
                addCoin(interaction, client.db, interaction.user.id, interaction.guild.id, randCoin);
            }
            else {
                // Reply
                await interaction.editReply({
                    content: `[🧑] You choose **${i.customId}**\n[🤖] I choose **${result}**\nResult : **You lose!**`,
                    components: [],
                });
            }
        });
    },
};
