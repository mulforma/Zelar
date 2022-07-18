import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import {
  Client,
  ChatInputCommandInteraction,
  GuildMember,
  ActionRowBuilder,
  ButtonBuilder,
  MessageComponentInteraction,
} from "discord.js";
import { ButtonStyle } from "discord-api-types/v10";

export default {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a user")
    .addUserOption((option) => option.setName("target").setDescription("Select a user to kick").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason for kick").setRequired(false)),
  category: "Mod",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get options value (target)
    const user = <GuildMember>await interaction.options.getMember("target")!;
    // Interaction member
    const { member } = interaction;
    // Check if user who called command has permissions 'KICK_MEMBERS'
    // More about Permission.FLAGS, see (https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS)
    if (!(member!.permissions as Readonly<PermissionsBitField>).has(PermissionsBitField.Flags.KickMembers)) {
      // Reply user
      return interaction.reply({
        // Set message content
        content: "You can't kick member because you have no permissions to kick.",
        // Set if only user who called command can see it
        ephemeral: true,
      });
    }

    // If target user has higher roles than called user
    if (!user.kickable) {
      // Set message content
      return interaction.reply({
        // Set message content
        content: "You can't kick member with higher role than you.",
        // Set if only user who called command can see it
        ephemeral: true,
      });
    }

    // Check if user want to kick yourself
    if (user.id === interaction.user.id) {
      // Set message content
      return interaction.reply({
        // Set message content
        content: "You can't kick yourself!",
        // Set if only user who called command can see it
        ephemeral: true,
      });
    }

    // Add message components
    const confirm = new ActionRowBuilder<ButtonBuilder>().addComponents(
      // Add button
      new ButtonBuilder()
        // Set button id
        .setCustomId("Confirm")
        // Set button message
        .setLabel("Confirm")
        // Set button style, see more (https://discord.js.org/#/docs/main/stable/typedef/ButtonBuilderStyle)
        .setStyle(ButtonStyle.Danger),
    );

    // Get reason string
    const reason = interaction.options.getString("reason");

    // Wait user to confirm
    await interaction.reply({
      content: `Are you sure you want to kick <@${user.id}>?`,
      components: [confirm],
      ephemeral: true,
    });

    // Filter for answer buttons
    const filter = (i: MessageComponentInteraction) =>
      // Check if id is Confirm and if it is the same user
      i.customId === "Confirm" && i.user.id === interaction.user.id;

    // Start message collector
    const collector = interaction.channel!.createMessageComponentCollector({
      // Add filter
      filter,
      // Set collector timeout (15 seconds)
      time: 15000,
    });

    // On collector start
    collector.on("collect", async (i: MessageComponentInteraction) => {
      // If button id equal to 'Confirm'
      if (i.customId === "Confirm") {
        // Kick user
        await user.kick(
          // Check if there is reason text, if not, reason equal to 'Unspecified'
          !reason ? "Unspecified" : reason,
        );

        // Update message
        await i.update({
          // Set message content
          content: `Successfully kick <@${user.id}>`,
          // Clear message button
          components: [],
        });
      }
    });
  },
};
