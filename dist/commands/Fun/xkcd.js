"use strict";
// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import MessageEmbed
const { MessageEmbed } = require("discord.js");
// Import axios
const axios = require("axios");
// Export command
module.exports = {
    // Set command data
    data: new SlashCommandBuilder()
        // Set command name
        .setName("xkcd")
        // Set command description
        .setDescription("Get a random xkcd comic"),
    // Set command category
    category: "Fun",
    // Execute function
    /**
     * @param {import("discord.js").Client} client
     * @param {import("discord.js").CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute(client, interaction) {
        // Get all possible xkcd comics
        const comics = await axios.get("https://xkcd.com/info.0.json");
        // Get random comic
        const { data } = await axios.get(`https://xkcd.com/${Math.floor(Math.random() * comics.data.num) + 1}/info.0.json`);
        // Create embed
        const embed = new MessageEmbed()
            // Set title
            .setTitle(`#${data.num} - ${data.title}`)
            // Set image
            .setImage(data.img)
            // Set description
            .setDescription(data.alt)
            // Set footer
            .setFooter({ text: `${data.year} - ${data.month}/${data.day}`, iconURL: client.user.avatarURL() });
        // Send embed
        interaction.reply({
            embeds: [embed],
        });
    },
};
