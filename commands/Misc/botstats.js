// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import MessageEmbed from Discord.js
const { MessageEmbed } = require("discord.js");
// Import ms
const ms = require("ms");
// Import os
const os = require("os");
// Import ipInfo
const ipInfo = require("ipinfo");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("bot-stats")
    // Set command description
    .setDescription("Check the bots stats.")
    // Add subcommands
    .addSubcommand((subcommand) =>
      subcommand
        // Set subcommand name
        .setName("bot")
        // Set subcommand description
        .setDescription("Check bot stats"),
    )
    // Add subcommands
    .addSubcommand((subcommand) =>
      subcommand
        // Set subcommand name
        .setName("server")
        // Set subcommand description
        .setDescription("Check server stats"),
    ),
  // Set command category
  category: "Misc",
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    // Get subcommand
    const subcommand = interaction.options.getSubcommand();
    // Promises
    const promises = [
      await client.shard.fetchClientValues("guilds.cache.size"),
      await client.shard.broadcastEval((c) => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
    ];

    switch (subcommand) {
      case "bot":
        // Reply with embed
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Bot info")
              .setColor("#0099ff")
              .setDescription(
                `
            **Servers:** ${promises[0].reduce((acc, guilds) => acc + guilds, 0)}
            **Members:** ${promises[1].reduce((acc, member) => acc + member, 0)}
            **Channels:** ${client.channels.cache.size}
            **Commands:** ${client.commands.size}
            **Uptime:** ${ms(client.uptime)}
            **Shards:** ${client.shard.count}
          `,
              )
              .setThumbnail(client.user.displayAvatarURL())
              .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.avatarURL(),
              }),
          ],
        });
        break;
      case "server": {
        // Get location
        let info = await ipInfo();
        await interaction.reply({
          embeds: [
            await new MessageEmbed()
              .setTitle("Bots server info")
              .setThumbnail(client.user.displayAvatarURL())
              .addField("Platform", `${os.platform()} ${os.release()}`)
              .addField("Architecture", os.arch())
              .addField("System Uptime", ms(ms(`${os.uptime()}s`)))
              .addField("Host location", `${info.city}, ${info.region} :flag_${info.country.toLowerCase()}:`)
              .addField("Host IP", info.ip)
              .addField("Host name", info.hostname)
              .addField("Host organization", info.org)
              .addField(
                "CPUs",
                `${os
                  .cpus()
                  .map((x) => x.model)
                  .join("\n")}`,
              )
              .addField("CPU Cores", `${os.cpus().length}`)
              .addField("RAM Free", `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`)
              .addField("RAM Total", `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`)
              .addField("RAM Usage", `${((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)}%`)
              .addField("Discord.js Version", `${require("discord.js").version}`)
              .addField("Node.js Version", `${process.version}`)
              .setColor("#0099ff")
              .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.avatarURL(),
              }),
          ],
        });
      }
    }
  },
};
