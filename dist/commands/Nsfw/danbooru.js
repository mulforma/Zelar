"use strict";
// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import axios
const axios = require("axios");
// Import MessageEmbed
const { MessageEmbed } = require("discord.js");
// Set rating
const rating = {
    e: "explicit",
    s: "safe",
    q: "questionable",
    u: "unknown",
};
// Export command
module.exports = {
    // Set command data
    data: new SlashCommandBuilder()
        // Set command name
        .setName("danbooru")
        // Set command description
        .setDescription("Search danbooru!")
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
        // Get random page
        const page = Math.floor(Math.random() * 100) + 1;
        // Get random image
        axios.get(`https://danbooru.donmai.us/posts.json?tags=${tags ? tags : ""}&page=${page}&limit=1`).then((res) => {
            // Send image
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle(`Image from ${res.data[0].tag_string_artist}`)
                        .setImage(res.data[0].file_url)
                        .setColor("GREEN")
                        .setURL(`https://danbooru.donmai.us/posts/${res.data[0].id}`)
                        .setFooter({ text: `rating: ${rating[res.data[0].rating]} | score: ${res.data[0].score}` }),
                ],
            });
        });
    },
};
