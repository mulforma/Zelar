import log from "npmlog";
import { Client, CommandInteraction } from "discord.js";

export default {
  name: "interactionCreate",
  description: "Triggered when a new interaction is created.",
  async run(client: Client, interaction: CommandInteraction) {
    // Check if interaction is command
    if (!interaction.isCommand()) return;

    // Search for existing commands
    const command = client.commands.get(interaction.commandName);

    /// If command is invalid, return
    if (!command) return;

    try {
      // Execute command
      await command.execute(client, interaction);
    } catch (error) {
      // Log when error
      log.error("", <string>error);
    }
  },
};
