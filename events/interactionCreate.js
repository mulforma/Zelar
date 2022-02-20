// Import npmlog
const log = require("npmlog");

module.exports = {
  name: "interactionCreate",
  description: "Triggered when a new interaction is created.",
  async run(client, interaction) {
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
      console.error(error);
    }
  },
};
