"use strict";
// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import axios
const axios = require("axios");
// Export command
module.exports = {
    // Set command data
    data: new SlashCommandBuilder()
        // Set command name
        .setName("deepfry")
        // Set command description
        .setDescription("Deepfries an image")
        // Add user option
        .addUserOption((option) => option
        // Set option name
        .setName("user")
        // Set option description
        .setDescription("The user to deepfry")
        // Set option required
        .setRequired(false)),
    // Set command category
    category: "Misc",
    // Execute function
    /**
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client, interaction) {
        // Defer reply
        interaction.deferReply();
        // Get user
        const user = interaction.options.getUser("user") || interaction.user;
        // Get user avatar
        const avatar = user.displayAvatarURL({ format: "png", size: 512 });
        // GET request to nekobot api
        // TODO: Instead of using the nekobot api, we just do it ourselves. Because this will affect the bots performance
        const { data } = await axios.get(`https://nekobot.xyz/api/imagegen?type=deepfry&image=${avatar}`);
        // Send deepfry avatar
        await interaction.editReply({
            files: [
                {
                    attachment: data.message,
                    name: "deepfry.png",
                },
            ],
        });
    },
};
