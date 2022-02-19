// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import Permission from discord.js
const { Permissions } = require("discord.js");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("channel")
    // Set command description
    .setDescription("Create or delete channel")
    // Set subcommands
    .addSubcommand((subcommand) =>
      subcommand
        // Set subcommand name
        .setName("create")
        // Set subcommand description
        .setDescription("Create channel")
        // Add string option
        .addStringOption((option) =>
          option
            // Set option name
            .setName("name")
            // Set option description
            .setDescription("Channel name")
            // Set option required
            .setRequired(true),
        )
        // Add string option
        .addStringOption((option) =>
          option
            // Set option name
            .setName("type")
            // Set option description
            .setDescription("Channel type")
            // Set option required
            .setRequired(true),
        )
        // Add string option
        .addStringOption((option) =>
          option
            // Set option name
            .setName("category")
            // Set option description
            .setDescription("Channel category")
            // Set option required
            .setRequired(false),
        )
        // Add string option
        .addStringOption((option) =>
          option
            // Set option name
            .setName("topic")
            // Set option description
            .setDescription("Channel topic")
            // Set option required
            .setRequired(false),
        )
        // Add boolean option
        .addBooleanOption((option) =>
          option
            // Set option name
            .setName("nsfw")
            // Set option description
            .setDescription("Channel nsfw")
            // Set option required
            .setRequired(false),
        ),
    )
    // Add subcommand
    .addSubcommand((subcommand) =>
      subcommand
        // Set subcommand name
        .setName("delete")
        // Set subcommand description
        .setDescription("Delete channel")
        // Add string option
        .addStringOption((option) =>
          option
            // Set option name
            .setName("name")
            // Set option description
            .setDescription("Channel name")
            // Set option required
            .setRequired(true),
        ),
    ),
  // Set command category
  category: "Mod",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    // Get subcommand
    const subcommand = interaction.options.getSubcommand();

    // Channel type
    const channelType = {
      text: "GUILD_TEXT",
      voice: "GUILD_VOICE",
    };

    // Check if user has permission
    if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
      // Reply user
      return await interaction.reply({
        // Set message content
        content: "You can't use this command because you don't have permission `MANAGE_CHANNELS`",
        // Set if only user who called command can see it
        ephemeral: true,
      });
    }

    switch (subcommand) {
      case "create": {
        // Get all options
        const name = interaction.options.getString("name");
        const type = interaction.options.getString("type");
        const category = interaction.options.getString("category");
        const topic = interaction.options.getString("topic");
        const nsfw = interaction.options.getBoolean("nsfw");

        // Check channel type
        const channelTypeElement = channelType[type];

        // Check if channel type is valid
        if (!channelTypeElement) {
          // Reply user
          return await interaction.reply({
            // Set message content
            content: "Channel type is invalid.\nValid types: text, voice",
            // Set if only user who called command can see it
            ephemeral: true,
          });
        }

        // Fetch guild channel
        const guildChannel = await interaction.guild.channels.fetch();

        // Create channel
        const channel = await interaction.guild.channels.create(name, {
          type: channelTypeElement,
          topic: topic || "",
          nsfw: nsfw || false,
          parent: category ? guildChannel.find((c) => c.name === category) : null,
        });
        interaction.reply(`Created channel ${channel.name}`);
        break;
      }
      case "delete": {
        // Get all options
        const channelName = interaction.options.getString("name");

        // Fetch guild channel
        const guildChannel2 = await interaction.guild.channels.fetch();

        // Fetch channel
        const fetchedChannel = guildChannel2.find((c) => c.name === channelName);

        // Check if channel exists
        if (!fetchedChannel) {
          // Reply user
          return await interaction.reply({
            // Set message content
            content: "Channel doesn't exist.",
            // Set if only user who called command can see it
            ephemeral: true,
          });
        }

        // Delete channel
        await fetchedChannel.delete();
        interaction.reply(`Deleted channel ${fetchedChannel.name}`);
        break;
      }
      default:
    }
  },
};
