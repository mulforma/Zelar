import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import os from "os";
import ms from "ms";

export default {
  data: new SlashCommandBuilder()
    .setName("bot-stats")
    .setDescription("Check the bots stats.")
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand.setName("bot").setDescription("Check bot stats"),
    )
    .addSubcommand((subcommand: SlashCommandSubcommandBuilder) =>
      subcommand.setName("server").setDescription("Check server stats"),
    ),
  category: "Misc",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get subcommand
    const subcommand = interaction.options.getSubcommand();
    // Promises
    const promises = [
      await client.shard!.fetchClientValues("guilds.cache.size"),
      await client.shard!.broadcastEval((c) => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
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
            **Servers:** ${promises[0].reduce((acc, guilds) => <number>acc + <number>guilds, 0)}
            **Members:** ${promises[1].reduce((acc, member) => <number>acc + <number>member, 0)}
            **Channels:** ${client.channels.cache.size}
            **Commands:** ${client.commands.size}
            **Uptime:** ${ms(client.uptime!)}
            **Shards:** ${client.shard!.count}
          `,
              )
              .setThumbnail(client.user!.displayAvatarURL())
              .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.avatarURL()!,
              }),
          ],
        });
        break;
      case "server": {
        // Get location
        await interaction.reply({
          embeds: [
            await new MessageEmbed()
              .setTitle("Bots server info")
              .setThumbnail(client.user!.displayAvatarURL())
              .addField("Platform", `${os.platform()} ${os.release()}`)
              .addField("Architecture", os.arch())
              .addField("System Uptime", ms(ms(`${os.uptime()}s`)))
              .addField("CPUs", `${[...new Set(os.cpus().map((x) => x.model))].join("\n")}`)
              .addField("CPU Cores", `${os.cpus().length}`)
              .addField("RAM Free", `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`)
              .addField("RAM Total", `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`)
              .addField("RAM Usage", `${((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)}%`)
              .addField("Discord.js Version", `${require("discord.js").version}`)
              .addField("Node.js Version", `${process.version}`)
              .setColor("#0099ff")
              .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.avatarURL()!,
              }),
          ],
        });
        break;
      }
      default:
    }
  },
};
