// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import MessageEmbed from discord.js
const { MessageEmbed } = require("discord.js");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("help")
    // Set command description
    .setDescription("Shows a list of commands.")
    // Add subcommands
    .addSubcommand((subcommand) =>
      subcommand
        // Set subcommand name
        .setName("all")
        // Set subcommand description
        .setDescription("Shows a list of all commands."),
    )
    // Add subcommands
    .addSubcommand((subcommand) =>
      subcommand
        // Set subcommand name
        .setName("command")
        // Set subcommand description
        .setDescription("Shows specific command information.")
        // Add string option
        .addStringOption((command) =>
          command
            // Set option name
            .setName("command")
            // Set option description
            .setDescription("The command to show information for.")
            // Set option required
            .setRequired(true),
        ),
    ),
  // Set command category
  category: "Misc",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    // Get all command categories
    const categories = new Set(client.commands.map((c) => c.category));
    // Get subcommand
    const subcommand = interaction.options.getSubcommand();

    // Create embed
    const embed = new MessageEmbed()
      .setColor("BLUE")
      .setTitle("𝗧𝗛𝗘 𝗡𝗜𝗡𝗧𝗢𝗗 𝗣𝗥𝗢𝗝𝗘𝗖𝗧")
      .setDescription("A simple, open-source, and free, fast,\nsecure and reliable discord bot.")
      .setFooter({
        text:
          subcommand === "all"
            ? "You can send `/help command` follow with command name to get more information about it."
            : "You can send `/help all` to list all commands",
        iconURL: client.user.avatarURL(),
      })
      .setThumbnail(client.user.displayAvatarURL())
      .setURL("https://x.vvx.bar/nt/git");

    // If subcommand is all
    switch (subcommand) {
      // If subcommand is all
      case "all":
        // Loop through categories
        for (const category of categories) {
          // Get all commands in category
          const commands = client.commands.filter((c) => c.category === category);

          // Add category to embed
          embed.addField(`${category}`, `${commands.map((c) => `\`${c.data.name}\``).join(" ")}`);
        }
        break;
      case "command": {
        // Get command
        const command = interaction.options.getString("command");
        // Get command
        const commandData = client.commands.find((c) => c.data.name === command);
        // If command is not found
        if (!commandData) {
          // Send error message
          await interaction.reply({ content: "Command not found." });
          // Return
          return;
        }
        // Add command to embed
        embed.addField(
          `${commandData.data.name.toUpperCase()}`,
          `**Description:** ${commandData.data.description}\n**Category:** ${
            commandData.category
          }\n**Options:** ${commandData.data.options.map((o) => `\`${o.name}\``).join(" ")}`,
        );
        break;
      }
    }

    // Reply with embed
    await interaction.reply({
      embeds: [embed],
    });
  },
};
