// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("leaderboard")
    // Set command description
    .setDescription("Shows the leaderboard")
    // Add subcommand
    .addSubcommand(subcommand =>
      subcommand
        // Set subcommand name
        .setName("global")
        // Set subcommand description
        .setDescription("Shows the global leaderboard")
    )
    // Add subcommand
    .addSubcommand(subcommand =>
      subcommand
        // Set subcommand name
        .setName("local")
        // Set subcommand description
        .setDescription("Shows the local leaderboard")
    ),
  // Set command category
  category: "Profile",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute (client, interaction) {
    // Get leaderboard scope
    const scope = interaction.options.getSubcommand() || "global";
    // Get leaderboard
    const leaderboard = await (scope ? client.db.select("*").from("user").where("serverId", interaction.guild.id).orderBy("coin", "desc") : client.db.select("*").from("user").orderBy("coin", "desc"));
    
    // Set items start and end
    let itemsStart = 0;
    let itemsEnd = 5;
  
    // Add message components
    const arrowButtons = new MessageActionRow().addComponents(
      // Add button
      new MessageButton()
        // Set button id
        .setCustomId("Previous")
        // Set button message
        .setLabel("⬅")
        // Set button style, see more (https://discord.js.org/#/docs/main/stable/typedef/MessageButtonStyle)
        .setStyle("PRIMARY"),
      // Add button
      new MessageButton()
        // Set button id
        .setCustomId("Next")
        // Set button message
        .setLabel("➡")
        // Set button style, see more (https://discord.js.org/#/docs/main/stable/typedef/MessageButtonStyle)
        .setStyle("PRIMARY"),
    );
      // Create embed
    const embed = new MessageEmbed()
      // Set title
      .setTitle("🏆 Leaderboard")
      // Set description that show latest 10 items
      .setDescription(
        // Get leaderboard list
        leaderboard.slice(itemsStart, itemsEnd).map(
          // Map leaderboard items
          (item, index) =>
            // Return leaderboard item
            `${index + 1}. <@${item.userId}> - ${item.coin} coins`
        ).join("\n")
      )
      // Set thumbnail
      .setThumbnail(client.user.displayAvatarURL({ format: "png", size: 1024 }))
      // Set footer
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ format: "png", size: 1024 }) });
    // Send embed
    await interaction.reply({
      embeds: [embed],
      components: [arrowButtons],
    });
  
    // Filter for answer buttons
    const filter = (i) =>
      // Check if id is Confirm and if it is the same user
      (i.customId === "Next" || i.customId === "Previous") && i.user.id === interaction.user.id;
  
    // Start message collector
    const collector = interaction.channel.createMessageComponentCollector({
      // Add filter
      filter,
      // Set collector timeout (60 seconds)
      time: 60000,
    });
  
    // On collector start
    collector.on("collect", async (/** @type {import('discord.js').MessageComponentInteraction}*/ i) => {
      // Defer Update
      await i.deferUpdate();
      // If button id equal to 'Next'
      if (i.customId === "Next") {
        // Check if it has reached the end of the array
        if (itemsEnd >= leaderboard.length) {
          return;
        }
        // Set items start and end
        itemsStart += 5;
        itemsEnd += 5;
        // Set description
        embed.setDescription(
          leaderboard
            .slice(itemsStart, itemsEnd)
            .map(
              (item, idx) =>
                `${idx + 1}. <@${item.userId}> - ${item.coin} coins`
            )
            .join("\n\n"),
        );
        // Send embed
        await i.editReply({
          embeds: [embed],
          components: [arrowButtons],
        });
      } else if (i.customId === "Previous") {
        // Check if it has reached the start of the array
        if (itemsStart <= 0) {
          return;
        }
        // Set items start and end
        itemsStart -= 5;
        itemsEnd -= 5;
        // Set description
        embed.setDescription(
          leaderboard
            .slice(itemsStart, itemsEnd)
            .map(
              (item, idx) =>
                `${idx + 1}. <@${item.userId}> - ${item.coin} coins`
            )
            .join("\n\n"),
        );
        // Send embed
        await i.editReply({
          embeds: [embed],
          components: [arrowButtons],
        });
      }
    });
  },
};