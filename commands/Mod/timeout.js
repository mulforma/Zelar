// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import Permission, MessageActionRow and MessageButton from discord.js
const { Permissions, MessageActionRow, MessageButton } = require("discord.js");

// Export command
module.exports = {
  // Command name
  data: new SlashCommandBuilder()
    // Command name
    .setName("timeout")
    // Command description
    .setDescription("Timeout a user")
    // Add user option
    .addUserOption((option) =>
      option
        // Set the option name
        .setName("target")
        // Set the option description
        .setDescription("Select a user to timeout")
        // Set the option type
        .setRequired(true),
    )
    // Add string option
    .addStringOption((option) =>
      option
        // Set the option name
        .setName("reason")
        // Set the option description
        .setDescription("Reason for timeout")
        // Set the option type
        .setRequired(false),
    )
    // Add integer option
    .addNumberOption((option) =>
      option
        // Set the option name
        .setName("time")
        // Set the option description
        .setDescription("Time to timeout in minutes (0 for clear)")
        // Set the option type
        .setRequired(false),
    ),
  category: "Mod",
  async execute(client, interaction) {
    // Get the target and time
    const user = await interaction.options.getMember("target");
    const time = interaction.options.getNumber("time");
    // Convert time to milliseconds
    const timeInMilliseconds = time * 60000;

    // Check if user has permission to timeout
    if (!interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
      // Send error message
      return await interaction.reply({
        content: "You can't timeout member because you have no permissions to moderate members.",
        ephemeral: true,
      });
    }

    // Check if user can be timed out
    if (!user.moderatable) {
      // Send error message
      return await interaction.reply({
        content: "You can't timeout member with higher role than you.",
        ephemeral: true,
      });
    }

    // Check if user timeout themselves
    if (user.id === interaction.user.id) {
      // Send error message
      return await interaction.reply({
        content: "You can't timeout yourself, and why would you?",
        ephemeral: true,
      });
    }

    // Add confirm button
    const confirm = new MessageActionRow().addComponents(
      /** @type any */
      (new MessageButton().setCustomId("Confirm").setLabel("Confirm").setStyle("DANGER")),
    );

    // Get reason
    const reason = await interaction.options.getString("reason");

    // Send confirmation message
    await interaction.reply({
      content: `Are you sure you want to timeout <@${user.id}>?`,
      components: [confirm],
      ephemeral: true,
    });

    // Filter confirm button
    const filter = (i) =>
      // Check if user is the same as interaction user
      i.customId === "Confirm" && i.user.id === interaction.user.id;

    // Wait for confirm button
    const collector = interaction.channel.createMessageComponentCollector({
      // Filter confirm button
      filter,
      // Timeout after 15 seconds
      time: 15000,
    });

    // On button is pressed
    collector.on("collect", async (i) => {
      // Check if button id is Confirm
      if (i.customId === "Confirm") {
        // Timeout user
        await user.timeout(time, { reason: reason ? reason : "Unspecified" });
        // Send success message
        await i.update({
          content: `Successfully ${timeInMilliseconds === 0 ? "clear timeout" : "timeout"} <@${user.id}>`,
          components: [],
        });
      }
    });
  },
};
