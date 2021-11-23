// Import SlashCommandBuilder
const { SlashCommandBuilder } = require('@discordjs/builders');

// Export command
module.exports = {
    // Set command data
    data: new SlashCommandBuilder()
    // Set command name
        .setName('ping')
    // Set command description
        .setDescription('Check bot\'s ping'),
    // Set command category
    category: 'Misc',
    // Execute function
    /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   */
    async execute(client, interaction) {
    // Wait for message to send
        const sent = await /** @type {import('discord.js').CommandInteraction}*/
        interaction.reply({
            content: 'Pinging...',
            fetchReply: true
        });
        // Roundtrip latency
        const time =
      /** @type {import('discord.js').Message} */
      (sent).createdTimestamp - interaction.createdTimestamp;
        // Reply with latency
        interaction.editReply(`
      Roundtrip latency : ${time}ms\nWebsocket heartbeat : ${client.ws.ping}ms
    `);
    }
};
