import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, Guild, MessageEmbed } from "discord.js";
import { createRequire } from "module";
import { version as discordVersion } from "discord.js";
import os from "os";
import ms from "ms";

const req = createRequire(import.meta.url);
const { version } = req("../../package.json");

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
      await client.shard!.broadcastEval((c) =>
        c.guilds.cache.reduce((acc: number, guild: Guild) => acc + guild.memberCount, 0),
      ),
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
            new MessageEmbed()
              .setTitle("Bots server info")
              .setThumbnail(client.user!.displayAvatarURL())
              .addField("Platform", `${os.platform()} ${os.release()}`, true)
              .addField("Architecture", os.arch(), true)
              .addField("System Uptime", ms(ms(`${os.uptime()}s`)), true)
              .addField("System Hostname", os.hostname(), true)
              .addField("CPUs", [...new Set(os.cpus().map((x) => x.model))].join("\n"), true)
              .addField("CPU Cores", os.cpus().length.toString(), true)
              .addField("RAM Free", `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`, true)
              .addField("RAM Total", `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, true)
              .addField("RAM Usage", `${((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)}%`, true)
              .addField("Discord.js Version", `v${discordVersion}`, true)
              .addField("Node.js Version", process.version, true)
              .addField("Bots Version", `v${version}`, true)
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
