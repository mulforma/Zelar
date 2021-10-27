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
    async execute(client, interaction) {
    // Wait for message to send
        const sent = await interaction.reply({
            content: 'Pinging...',
            fetchReply: true
        });
        // Roundtrip latency
        const time = sent.createdTimestamp - interaction.createdTimestamp;
        // Reply with latency
        interaction.editReply(`
      Roundtrip latency : ${time}ms\nWebsocket heartbeat : ${client.ws.ping}ms
    `);
    }
};
