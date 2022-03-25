// Import SlashCommandBuilder
import { SlashCommandBuilder } from "@discordjs/builders";
// Import Client and CommandInteraction
import { Client, CommandInteraction, Message } from "discord.js";

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
    const sent = <Message>await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });

    // Round-trip latency
    const time = sent.createdTimestamp - interaction.createdTimestamp;
    // Reply with latency
    await interaction.editReply(`
      Round trip latency : ${time}ms\nWebsocket heartbeat : ${client.ws.ping}ms
    `);
  },
};
