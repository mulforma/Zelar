// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

// Export command
module.exports = {
    // Set command data
    data: new SlashCommandBuilder()
        // Set command name
        .setName("coin-flip")
        // Set command description
        .setDescription("Flips a coin and returns the result"),
    // Set command category
    category: "Game",
    // Execute function
    /**
     * @param {import('discord.js').Client} client
     * @param {import('discord.js').CommandInteraction} interaction
     * @returns {Promise<void>}
     */
    async execute (client, interaction) {
        let genNum = Math.ceil(Math.random() * 100)
        let isEven =  genNum % 2 === 0;

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle("🎲 Coin Flip")
                    .addField("Result", isEven ? "Heads" : "Tails")
                    .addField("Generated Number", String(genNum))
                    .setColor(0x00FF00)
            ]
        })
    },
};
