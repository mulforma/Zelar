"use strict";
// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Export command
module.exports = {
    // Set command data
    data: new SlashCommandBuilder()
        // Set command name
        .setName("skip")
        // Set command description
        .setDescription("Skips the current song."),
    // Set command category
    category: "Music",
    // Execute function
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client, interaction) {
        // Get queue
        const queue = client.player.getQueue(interaction.guild.id);
        // Check if queue is empty
        if (!queue) {
            // Send error message
            return interaction.reply({
                content: "There is no song playing.",
            });
        }
        // Skip song
        const success = queue.skip();
        // Check if skip was successful
        if (success) {
            // Send success message
            return interaction.reply({
                content: "Skipped the current song.",
            });
        }
        // Send error message
        return interaction.reply({
            content: "Something went wrong...",
        });
    },
};
