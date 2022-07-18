import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { Client, ChatInputCommandInteraction, Guild, EmbedBuilder } from "discord.js";
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
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
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
            new EmbedBuilder()
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
            new EmbedBuilder()
              .setTitle("Bots server info")
              .setThumbnail(client.user!.displayAvatarURL())
              .addFields([
                { name: "Platform", value: `${os.platform()} ${os.release()}`, inline: true },
                { name: "Architecture", value: os.arch(), inline: true },
                { name: "System Uptime", value: ms(ms(`${os.uptime()}s`)), inline: true },
                { name: "System Hostname", value: os.hostname(), inline: true },
                { name: "CPUs", value: [...new Set(os.cpus().map((x) => x.model))].join("\n"), inline: true },
                { name: "CPU Cores", value: os.cpus().length.toString(), inline: true },
                { name: "RAM Free", value: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`, inline: true },
                { name: "RAM Total", value: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`, inline: true },
                { name: "RAM Usage", value: `${((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)}%`, inline: true },
                { name: "Discord.js Version", value: `v${discordVersion}`, inline: true },
                { name: "Node.js Version", value: process.version, inline: true },
                { name: "Bots Version", value: `v${version}`, inline: true },
              ])
              .setColor([0, 153, 255])
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
