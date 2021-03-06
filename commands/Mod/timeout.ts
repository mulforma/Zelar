import { SlashCommandBuilder } from "discord.js";
import {
  Client,
  ChatInputCommandInteraction,
  GuildMember,
  ActionRowBuilder,
  ButtonBuilder,
  MessageComponentInteraction,
  PermissionsBitField,
} from "discord.js";
import { ButtonStyle } from "discord-api-types/v10";

export default {
  // Command name
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user")
    .addUserOption((option) => option.setName("target").setDescription("Select a user to timeout").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason for timeout").setRequired(false))
    .addNumberOption((option) =>
      option.setName("time").setDescription("Time to timeout in minutes (0 for clear)").setRequired(false),
    ),
  category: "Mod",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get the target and time
    const user = <GuildMember>await interaction.options.getMember("target")!;
    const time = interaction.options.getNumber("time")!;
    // Convert time to milliseconds
    const timeInMilliseconds = time * 60000;

    // Check if user has permission to timeout
    if (
      !(interaction.member!.permissions as Readonly<PermissionsBitField>).has(PermissionsBitField.Flags.ModerateMembers)
    ) {
      // Send error message
      return interaction.reply({
        content: "You can't timeout member because you have no permissions to moderate members.",
        ephemeral: true,
      });
    }

    // Check if user can be timed out
    if (!user.moderatable) {
      // Send error message
      return interaction.reply({
        content: "You can't timeout member with higher role than you.",
        ephemeral: true,
      });
    }

    // Check if user timeout themselves
    if (user.id === interaction.user.id) {
      // Send error message
      return interaction.reply({
        content: "You can't timeout yourself, and why would you?",
        ephemeral: true,
      });
    }

    // Add confirm button
    const confirm = new ActionRowBuilder<ButtonBuilder>().addComponents(
      /** @type any */
      new ButtonBuilder().setCustomId("Confirm").setLabel("Confirm").setStyle(ButtonStyle.Danger),
    );

    // Get reason
    const reason = interaction.options.getString("reason")!;

    // Send confirmation message
    await interaction.reply({
      content: `Are you sure you want to timeout <@${user.id}>?`,
      components: [confirm],
      ephemeral: true,
    });

    // Filter confirm button
    const filter = (i: MessageComponentInteraction) =>
      // Check if user is the same as interaction user
      i.customId === "Confirm" && i.user.id === interaction.user.id;

    // Wait for confirm button
    const collector = interaction.channel!.createMessageComponentCollector({
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
        await user.timeout(time, reason);
        // Send success message
        await i.update({
          content: `Successfully ${timeInMilliseconds === 0 ? "clear timeout" : "timeout"} <@${user.id}>`,
          components: [],
        });
      }
    });
  },
};
