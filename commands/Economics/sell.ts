import { SlashCommandBuilder } from "@discordjs/builders";
import { getUserData } from "../../methods/getUserData.js";
import { getItemData } from "../../methods/getItemData.js";
import { Client, CommandInteraction } from "discord.js";
import { InventoryItemData } from "../../types/InventoryItemData";

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
    const userData = await getUserData(interaction, client.db, interaction.user.id, interaction.guild!.id);
    // Get items array
    const itemsArr = userData.inventory.items.map((i: InventoryItemData) => i.name);
    // Check if user has item
    if (!itemsArr.includes(item)) {
      // Send error message
      return interaction.reply(`You don't have any ${item} to sell!`);
    }

    // Get items as json
    const itemsJson = userData.inventory.items.find((i: InventoryItemData) => i.name === item);

    // Check if amount is valid
    if (itemsJson.amount < amount!) {
      // Send error message
      return interaction.reply(`You don't have that many ${item} to sell!`);
    }

    // Get market price
    const [marketPrice] = await getItemData(client.db, "itemId", itemsJson.id);

    // Check if market has item
    if (!marketPrice.price) {
      return interaction.reply(`The market doesn't have any ${item}!`);
    }

    // Get item index
    const itemIndex = userData.inventory.items.findIndex((i: InventoryItemData) => i.name === item);

    // Remove item amount
    userData.inventory.items[itemIndex].amount -= amount!;

    // Check if item amount is 0
    if (userData.inventory.items[itemIndex].amount === 0) {
      // Remove item
      userData.inventory.items.splice(item, 1);
    }

    // Update inventory anc calculate new balance
    client
      .db("user")
      .update({
        inventory: JSON.stringify(userData.inventory),
        coin: Number(userData.coin) + amount! * Number(marketPrice.price),
      })
      .where({
        userId: interaction.user.id,
        serverId: interaction.guild!.id,
      })
      .then(() => {
        // Send success message
        interaction.reply(`You sold ${amount} ${item} for ${amount! * marketPrice.price!} coins!`);
      });
  },
};
