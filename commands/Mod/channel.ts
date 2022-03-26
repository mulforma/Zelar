import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, GuildChannelCreateOptions, Permissions } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("channel")
    .setDescription("Create or delete channel")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create channel")
        .addStringOption((option) => option.setName("name").setDescription("Channel name").setRequired(true))
        .addStringOption((option) => option.setName("type").setDescription("Channel type").setRequired(true))
        .addStringOption((option) => option.setName("category").setDescription("Channel category").setRequired(false))
        .addStringOption((option) => option.setName("topic").setDescription("Channel topic").setRequired(false))
        .addBooleanOption((option) => option.setName("nsfw").setDescription("Channel nsfw").setRequired(false)),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete channel")
        .addStringOption((option) => option.setName("name").setDescription("Channel name").setRequired(true)),
    ),
  category: "Mod",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get subcommand
    const subcommand = interaction.options.getSubcommand();

    // Channel type
    const channelType = {
      text: "GUILD_TEXT",
      voice: "GUILD_VOICE",
    };

    // Check if user has permission
    if (!(interaction.member!.permissions as Readonly<Permissions>).has(Permissions.FLAGS.MANAGE_CHANNELS)) {
      // Reply user
      return interaction.reply({
        // Set message content
        content: "You can't use this command because you don't have permission `MANAGE_CHANNELS`",
        // Set if only user who called command can see it
        ephemeral: true,
      });
    }

    switch (subcommand) {
      case "create": {
        // Get all options
        const name = interaction.options.getString("name")!;
        const type = <"text" | "voice">interaction.options.getString("type")!;
        const category = interaction.options.getString("category")!;
        const topic = interaction.options.getString("topic")!;
        const nsfw = interaction.options.getBoolean("nsfw")!;

        // Check channel type
        const channelTypeElement = channelType[type];

        // Check if channel type is valid
        if (!channelTypeElement) {
          // Reply user
          return interaction.reply({
            // Set message content
            content: "Channel type is invalid.\nValid types: text, voice",
            // Set if only user who called command can see it
            ephemeral: true,
          });
        }

        // Fetch guild channel
        const guildChannel = await interaction.guild!.channels.fetch();

        // Create channel
        const channel = await interaction.guild!.channels.create(name, <GuildChannelCreateOptions>{
          type: channelTypeElement,
          topic: topic,
          nsfw: nsfw,
          parent: guildChannel.find((c) => c.name === category),
        });
        await interaction.reply(`Created channel ${channel.name}`);
        break;
      }
      case "delete": {
        // Get all options
        const channelName = interaction.options.getString("name");

        // Fetch guild channel
        const guildChannel2 = await interaction.guild!.channels.fetch();

        // Fetch channel
        const fetchedChannel = guildChannel2.find((c) => c.name === channelName);

        // Check if channel exists
        if (!fetchedChannel) {
          // Reply user
          return interaction.reply({
            // Set message content
            content: "Channel doesn't exist.",
            // Set if only user who called command can see it
            ephemeral: true,
          });
        }

        // Delete channel
        await fetchedChannel.delete();
        await interaction.reply(`Deleted channel ${fetchedChannel.name}`);
        break;
      }
      default:
    }
  },
};
