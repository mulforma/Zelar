import { SlashCommandBuilder } from "@discordjs/builders";
import { getUserData } from "../../methods/getUserData.js";
import { Client, CommandInteraction } from "discord.js";
import { InventoryItemData } from "../../types/InventoryItemData";
import { prisma } from "../../prisma/connect.js";

export default {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buy an item from the shop.")
    .addStringOption((option) => option.setName("item").setDescription("The item you want to buy.").setRequired(true))
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("The amount of the item you want to buy.").setRequired(true),
    ),
  category: "Economics",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get user data
    const user = await getUserData(interaction, interaction.user.id, interaction.guild!.id);
    // Get item
    const item = interaction.options.getString("item");
    // Get amount
    const amount = interaction.options.getInteger("amount")!;

    // Check if amount is 0 or less
    if (amount <= 0) {
      // Send error message
      await interaction.reply(
        `You can't buy 0 ${item}s. The universe is not infinite. Get your head out of the clouds.`,
      );
      // Return
      return;
    }

    // Get item from shop
    const shopItem = await prisma.officialShop.findFirst({
      where: {
        itemName: item,
      },
    });

    // Check if item exists
    if (!shopItem) {
      // Reply with error
      return interaction.reply("That item doesn't exist in the shop.\nUse `/shop` to see all items.");
    }
    // Check if user has enough money
    if (Number(user.coin) < Number(Number(shopItem.itemPrice) * amount)) {
      // Reply with error
      return interaction.reply(
        `You need more ${Number(shopItem.itemPrice) - Number(user.coin)} coins to buy this item.`,
      );
    }

    // Update user data
    prisma.user.updateMany({
      where: {
        userId: interaction.user.id,
        serverId: interaction.guild!.id,
      },
      data: {
        coin: Number(user.coin) - Number(Number(shopItem.itemPrice) * amount),
      },
    });

    // Check if user has item
    if (user.inventory.items.findIndex((i: InventoryItemData) => i.name === shopItem.itemName) !== -1) {
      // Update items amount
      user.inventory.items[
        user.inventory.items.findIndex((i: InventoryItemData) => i.name === shopItem.itemName)
      ].amount += amount;
    } else {
      // Add to inventory
      user.inventory.items.push({
        amount,
        description: shopItem.itemDescription,
        emoji: shopItem.itemEmoji,
        id: shopItem.itemId,
        name: shopItem.itemName,
        rarity: shopItem.itemRarity,
        type: shopItem.itemType,
      });
    }

    // Save user data
    await prisma.user.updateMany({
      where: {
        userId: interaction.user.id,
        serverId: interaction.guild!.id,
      },
      data: {
        inventory: JSON.stringify(user.inventory, (_, v) => (typeof v === "bigint" ? `${v}n` : v)).replace(
          /"(-?\d+)n"/g,
          (_, a) => a,
        ),
      },
    });

    // Reply with success
    return interaction.reply(`You bought ${shopItem.itemName} for ${Number(shopItem.itemPrice) * amount} coins.`);
  },
};
