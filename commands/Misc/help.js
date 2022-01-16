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
    .setDescription("Shows a list of commands."),
  // Set command category
  category: "Misc",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute (client, interaction) {
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor("BLUE")
          .setTitle("𝗧𝗛𝗘 𝗡𝗜𝗡𝗧𝗢𝗗 𝗣𝗥𝗢𝗝𝗘𝗖𝗧")
          .setDescription("A simple, open-source, and free, fast,\nsecure and reliable discord bot.")
          .addField("All commands: ", "https://x.vvx.bar/nt/cmd")
          .addField("Invite to server: ", "https://x.vvx.bar/nt/inv")
          .addField("Support server: ", "https://x.vvx.bar/nt/sup")
          .setFooter({ text: `Request by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
          .setThumbnail(client.user.displayAvatarURL())
          .setURL("https://x.vvx.bar/nt/git")
        ],
    })
  },
};