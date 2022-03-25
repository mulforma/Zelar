// Import SlashCommandBuilder
import { SlashCommandBuilder } from "@discordjs/builders";
// Import Permissions, MessageActionRow, MessageButton
import {
  Client,
  CommandInteraction,
  GuildMember,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
  Permissions,
} from "discord.js";

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("kick")
    // Set command description
    .setDescription("Kick a user")
    // Add command options
    .addUserOption((option) =>
      option
        // Set option name
        .setName("target")
        // Set option description
        .setDescription("Select a user to kick")
        // Set if option is required
        .setRequired(true),
    )
    // Add string option
    .addStringOption((option) =>
      option
        // Set option name
        .setName("reason")
        // Set option description
        .setDescription("Reason for kick")
        // Set if option is required
        .setRequired(false),
    ),
  // Set command category
  category: "Mod",
  // Execute function
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get options value (target)
    const user = <GuildMember>await interaction.options.getMember("target")!;
    // Interaction member
    const { member } = (interaction);
    // Check if user who called command has permissions 'KICK_MEMBERS'
    // More about Permission.FLAGS, see (https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS)
    if (!(member!.permissions as Readonly<Permissions>).has(Permissions.FLAGS.KICK_MEMBERS)) {
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
