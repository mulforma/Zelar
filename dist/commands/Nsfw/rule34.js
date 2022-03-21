"use strict";
// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import axios
const axios = require("axios");
// Import MessageEmbed
const { MessageEmbed } = require("discord.js");
// Export command
module.exports = {
    // Set command data
    data: new SlashCommandBuilder()
        // Set command name
        .setName("rule34")
        // Set command description
        .setDescription("Search rule34!")
        // Add string option
        .addStringOption((option) => option
        // Set option name
        .setName("tag")
        // Set option description
        .setDescription("The tag to search for (Separate with commas)")
        // Set option required
        .setRequired(false)),
    // Set command category
    category: "Nsfw",
    // Execute function
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client, interaction) {
        // Check if channel is NSFW
        if (!interaction.channel.nsfw) {
            // Send error message
            await interaction.reply({
                embeds: [new MessageEmbed().setColor("#ff0000").setDescription("This channel is not NSFW")],
            });
            // Return
            return;
        }
        // Get tags
        const tags = interaction.options.getString("tag")
            ? // If tag is undefined
                interaction.options.getString("tag").split(",").join("+")
            : // Else
                "";
        // Fetch random image
        const { data } = await axios.get(`https://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${tags}&json=1`);
        // Get random image
        const image = data[Math.floor(Math.random() * data.length)];
        // Send image
        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`Image from ${image.owner}`)
                    .setColor("#ffb6c1")
                    .setImage(image.file_url)
                    .setFooter({ text: `rating: ${image.rating} | score: ${image.score}` })
                    .setURL(`https://gelbooru.com/index.php?page=post&s=view&id=${image.id}`),
            ],
        });
    },
};
