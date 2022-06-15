import { SlashCommandBuilder } from "@discordjs/builders";
import { getItemData } from "../../methods/getItemData.js";
import { Client, CommandInteraction } from "discord.js";
import { InventoryItemData } from "../../types/InventoryItemData";
import { prisma } from "../../database/connect.js";
import { getInventory } from "../../methods/getInventory.js";

export default {
  data: new SlashCommandBuilder()
    .setName("sell")
    .setDescription("Sell an item")
    .addStringOption((option) => option.setName("item").setDescription("The item to sell").setRequired(true))
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("The amount of the item to sell").setRequired(true),
    ),
  category: "Economics",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get item
    const item = interaction.options.getString("item");
    // Get amount
    const amount = interaction.options.getInteger("amount");

    // Get user
    const inventory = await getInventory(interaction, interaction.user.id, interaction.guild!.id);
    // Get items array
    const itemsArr = inventory.items.map((i: InventoryItemData) => i.name);
    // Check if user has item
    if (!itemsArr.includes(item)) {
      // Send error message
      return interaction.reply(`You don't have any ${item} to sell!`);
    }

    // Get items as json
    const itemsJson = inventory.items.find((i: InventoryItemData) => i.name === item);

    // Check if amount is valid
    if (itemsJson.amount < amount!) {
      // Send error message
      return interaction.reply(`You don't have that many ${item} to sell!`);
    }

    // Get market price
    const marketPrice = await getItemData("itemName", (itemsJson.name));

    // Check if market has item
    if (!marketPrice?.price) {
      return interaction.reply(`The market doesn't have any ${item}!`);
    }

    // Get item index
    const itemIndex = inventory.items.findIndex((i: InventoryItemData) => i.name === item);

    // Remove item amount
    inventory.items[itemIndex].amount -= amount!;

    // Check if item amount is 0
    if (inventory.items[itemIndex].amount === 0) {
      // Remove item
      inventory.items.splice(item, 1);
    }

    // Update inventory anc calculate new balance
    prisma.user
      .updateMany({
        where: {
          userId: BigInt(interaction.user.id),
          serverId: BigInt(interaction.guild!.id),
        },
        data: {
          inventory: JSON.stringify(inventory, (_, v) => (typeof v === "bigint" ? `${v}n` : v)).replace(
            /"(-?\d+)n"/g,
            (_, a) => a,
          ),
          coin: {
            increment: Number(Number(marketPrice.price) * amount!),
          },
        },
      })
      .then(() => {
        // Send success message
        interaction.reply(`You sold ${amount} ${item} for ${amount! * Number(marketPrice?.price)} coins!`);
      });
  },
};
