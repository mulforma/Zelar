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
  data: new SlashCommandBuilder().setName("shop").setDescription("Shows the shop."),
  category: "Economics",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get shop
    const shop = await prisma.officialShop.findMany();
    // Set items start and end
    let itemsStart = 0,
      itemsEnd = 5;

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
      .setTitle("🛒 Global Market")
      // Set description that show latest 5 items
      .setDescription(
        shop
          .slice(itemsStart, itemsEnd)
          .map(
            (item: any) =>
              `${item.itemEmoji} **${item.itemName}** - ${item.itemPrice} coins\n**Item ID** \`${item.itemId}\`\n**Item Type** \`${item.itemType}\`\n**Item Description**: \`${item.itemDescription}\``,
          )
          .join("\n\n"),
      )
      // Set thumbnail
      .setThumbnail(client.user!.displayAvatarURL({ size: 1024 }))
      // Set footer
      .setFooter({ text: "Use `/buy <item>` to buy an item.", iconURL: client.user!.displayAvatarURL() });
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
    const collector = interaction.channel!.createMessageComponentCollector({
      // Add filter
      filter,
      // Set collector timeout (60 seconds)
      time: 60000,
    });

    // On collector start
    collector.on("collect", async (i: MessageComponentInteraction) => {
      // Defer Update
      await i.deferUpdate();
      // If button id equal to 'Next'
      if (i.customId === "Next") {
        // Check if it has reached the end of the array
        if (itemsEnd >= shop.length) {
          return;
        }
        // Set items start and end
        itemsStart += 5;
        itemsEnd += 5;
        embed.setDescription(
          shop
            .slice(itemsStart, itemsEnd)
            .map(
              (item: any) =>
                `${item.itemEmoji} **${item.itemName}** - ${item.itemPrice} coins\n**Item ID** \`${item.itemId}\`\n**Item Type** \`${item.itemType}\`\n**Item Description**: \`${item.itemDescription}\``,
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
        embed.setDescription(
          shop
            .slice(itemsStart, itemsEnd)
            .map(
              (item: any) =>
                `${item.itemEmoji} **${item.itemName}** - ${item.itemPrice} coins\n**Item ID** \`${item.itemId}\`\n**Item Type** \`${item.itemType}\`\n**Item Description**: \`${item.itemDescription}\``,
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
