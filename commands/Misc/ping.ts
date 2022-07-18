import { SlashCommandBuilder } from "discord.js";
import { Client, ChatInputCommandInteraction, Message } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("Check bots ping"),
  category: "Misc",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
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
