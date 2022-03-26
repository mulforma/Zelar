const { SlashCommandBuilder } = require("@discordjs/builders");
const tinyURL = require("tinyurl");

export default {
  data: new SlashCommandBuilder()
    .setName("short")
    .setDescription("Shorten a url")
    .addStringOption((option) => option.setName("url").setDescription("The url to shorten").setRequired(true)),
  category: "Utils",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get url
    const url = interaction.options.getString("url");

    // Shorten url
    const shortUrl = await tinyURL.shorten(url);

    // Send message
    await interaction.reply({ content: /**@type String*/ (shortUrl === "Error" ? "Something went wrong" : shortUrl) });
  },
};
