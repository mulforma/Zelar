// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("ping")
    // Set command description
    .setDescription("Check bots ping"),
  // Set command category
  category: "Misc",
  // Execute function
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Wait for message to send
    const sent = await /** @type {import('discord.js').CommandInteraction}*/ interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });

    // Round-trip latency
    const time =
      /** @type {import('discord.js').Message} */
      (sent).createdTimestamp - interaction.createdTimestamp;
    // Reply with latency
    await interaction.editReply(`
      Round trip latency : ${time}ms\nWebsocket heartbeat : ${client.ws.ping}ms
    `);
  },
};
