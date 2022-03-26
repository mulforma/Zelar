import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Message } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("Check bots ping"),
  category: "Misc",
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
