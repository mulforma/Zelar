// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import tinyURL
const tinyURL = require("tinyurl");

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("short")
    // Set command description
    .setDescription("Shorten a url")
    // Add string option
    .addStringOption((option) =>
      option
        // Set option name
        .setName("url")
        // Set option description
        .setDescription("The url to shorten")
        // Set option required
        .setRequired(true),
    ),
  // Set command category
  category: "Utils",
  // Execute function
  async execute (client : Client, interaction : CommandInteraction) : Promise<void> {
    // Get url
    const url = interaction.options.getString("url");
    
    // Shorten url
    const shortUrl = await tinyURL.shorten(url);
    
    // Send message
    await interaction.reply({ content: /**@type String*/ ( shortUrl === "Error" ? "Something went wrong" : shortUrl ) });
  },
};
