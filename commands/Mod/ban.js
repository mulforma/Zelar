// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import Permissions, MessageActionRow, MessageButton
const { Permissions, MessageActionRow, MessageButton } = require("discord.js");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("ban")
    // Set command description
    .setDescription("ban a user")
    // Add command options
    .addUserOption((option) =>
      option
        // Set option name
        .setName("target")
        // Set option description
        .setDescription("Select a user to ban")
        // Set if option is required
        .setRequired(true),
    )
    // Add string option
    .addStringOption((option) =>
      option
        // Set option name
        .setName("reason")
        // Set option description
        .setDescription("Reason for ban")
        // Set if option is required
        .setRequired(false),
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
    // Get options value (target)
    const user = await /** @type {import('discord.js').GuildMember} */ (interaction.options.getMember("target"));
    // Interaction member
    const { member } = /** @type {import('discord.js').GuildMember} */ (interaction);
    // Check if user who called command has permissions 'BAN_MEMBERS'
    // More about Premission.FLAGS, see (https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS)
    if (!member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
      // Reply user
      return interaction.reply({
        // Set message content
        content: "You can't ban member because you have no permissions to ban.",
        // Set if only user who called command can see it
        ephemeral: true,
      });
    }

    // If target user has higher roles than called user
    if (!user.bannable) {
      // Set message content
      return interaction.reply({
        // Set message content
        content: "You can't ban member with higher role than you.",
        // Set if only user who called command can see it
        ephemeral: true,
      });
    }

    // Check if user want to kick yourself
    if (user.id === interaction.user.id) {
      // Set message content
      return interaction.reply({
        // Set message content
        content: "You can't ban yourself!",
        // Set if only user who called command can see it
        ephemeral: true,
      });
    }

    // Add message components
    const confirm = new MessageActionRow().addComponents(
      // Add button
      new MessageButton()
        // Set button id
        .setCustomId("Confirm")
        // Set button message
        .setLabel("Confirm")
        // Set button style, see more (https://discord.js.org/#/docs/main/stable/typedef/MessageButtonStyle)
        .setStyle("DANGER"),
    );

    // Get reason string
    const reason = interaction.options.getString("reason");

    // Wait user to confirm
    await interaction.reply({
      content: `Are you sure you want to ban <@${user.id}>?`,
      components: [confirm],
      ephemeral: true,
    });

    // Filter for answer buttons
    const filter = (i) =>
      // Check if id is Confirm and if it is the same user
      i.customId === "Confirm" && i.user.id === interaction.user.id;

    // Start message collector
    const collector = interaction.channel.createMessageComponentCollector({
      // Add filter
      filter,
      // Set collector timeout (15 seconds)
      time: 15000,
    });

    // On collector start
    collector.on("collect", async (/** @type {import('discord.js').MessageComponentInteraction}*/ i) => {
      // If button id equal to 'Confirm'
      if (i.customId === "Confirm") {
        // Ban user
        await user.ban(
          // Check if there is reason text, if not, reason equal to 'Unspecified'
          { reason: reason ? reason : "Unspecified" },
        );

        // Update message
        await i.update({
          // Set message content
          content: `Successfully ban <@${user.id}>`,
          // Clear message button
          components: [],
        });
      }
    });
  },
};
