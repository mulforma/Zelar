import { SlashCommandBuilder } from "discord.js";
import {
  Client,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  MessageComponentInteraction,
  EmbedBuilder,
} from "discord.js";
import { prisma } from "../../prisma/connect.js";
import { ButtonStyle } from "discord-api-types/v10";

export default {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the leaderboard")
    .addSubcommand((subcommand) => subcommand.setName("global").setDescription("Shows the global leaderboard"))
    .addSubcommand((subcommand) => subcommand.setName("local").setDescription("Shows the local leaderboard")),
  category: "Profile",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get leaderboard scope
    const scope = interaction.options.getSubcommand() || "global";
    // Get leaderboard
    const leaderboard = await (scope !== "global"
      ? //@eslint-disable-next-line
        prisma.user.findMany({
          where: { serverId: interaction.guild!.id },
          orderBy: { coin: "desc" },
          take: 100,
        })
      : prisma.user.findMany({ orderBy: { coin: "desc" }, take: 100 }));

    // Set items start and end
    let itemsStart = 0;
    let itemsEnd = 5;

    // Add message components
    const arrowButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      // Add button
      new ButtonBuilder()
        // Set button id
        .setCustomId("Previous")
        // Set button message
        .setLabel("⬅")
        // Set button style, see more (https://discord.js.org/#/docs/main/stable/typedef/ButtonBuilderStyle)
        .setStyle(ButtonStyle.Primary),
      // Add button
      new ButtonBuilder()
        // Set button id
        .setCustomId("Next")
        // Set button message
        .setLabel("➡")
        // Set button style, see more (https://discord.js.org/#/docs/main/stable/typedef/ButtonBuilderStyle)
        .setStyle(ButtonStyle.Primary),
    );
    // Create embed
    const embed = new EmbedBuilder()
      // Set title
      .setTitle("🏆 Leaderboard")
      // Set description that show latest 10 items
      .setDescription(
        // Get leaderboard list
        leaderboard
          .slice(itemsStart, itemsEnd)
          .map(
            // Map leaderboard items
            (item, index: number) =>
              // Return leaderboard item
              `${index + 1}. <@${item.userId}> - ${item.coin} coins`,
          )
          .join("\n"),
      )
      // Set thumbnail
      .setThumbnail(client.user?.displayAvatarURL({ size: 1024 }) ?? "")
      // Set footer
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
      });
    // Send embed
    await interaction.reply({
      embeds: [embed],
      components: [arrowButtons],
    });

    // Filter for answer buttons
    const filter = (i: MessageComponentInteraction) =>
      // Check if id is Confirm and if it is the same user
      (i.customId === "Next" || i.customId === "Previous") && i.user.id === interaction.user.id;

    // Start message collector
    const collector = interaction.channel?.createMessageComponentCollector({
      // Add filter
      filter,
      // Set collector timeout (60 seconds)
      time: 60000,
    });

    // On collector start
    collector?.on("collect", async (i: MessageComponentInteraction) => {
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
        embed.setDescription(
          leaderboard
            .slice(itemsStart, itemsEnd)
            .map((item, idx: number) => `${idx + 1}. <@${item.userId}> - ${item.coin} coins`)
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
        embed.setDescription(
          leaderboard
            .slice(itemsStart, itemsEnd)
            .map((item, idx: number) => `${idx + 1}. <@${item.userId}> - ${item.coin} coins`)
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
