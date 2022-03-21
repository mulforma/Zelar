"use strict";
// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
// Export command
module.exports = {
    // Set command data
    data: new SlashCommandBuilder()
        // Set command name
        .setName("avatar")
        // Set command description
        .setDescription("Get a user's avatar")
        // Add user option
        .addUserOption((option) => option
        // Set name
        .setName("target")
        // Set description
        .setDescription("The user to get the avatar of")
        // Set required
        .setRequired(false)),
    // Set command category
    category: "Misc",
    // Execute function
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client, interaction) {
        // Get target
        const target = interaction.options.getUser("target") || interaction.user;
        // Send user's avatar
        await interaction.reply({
            embeds: [
                // Set embed
                new MessageEmbed()
                    // Set title
                    .setTitle(`${target.username}'s avatar`)
                    // Set image
                    .setImage(target.displayAvatarURL({
                    format: "png",
                    size: 4096,
                    dynamic: true,
                }))
                    // Set footer
                    .setFooter({ text: `Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL() }),
            ],
        });
    },
};
