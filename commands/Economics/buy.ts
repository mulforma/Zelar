// Import SlashCommandBuilder
import { SlashCommandBuilder } from "@discordjs/builders";
// Import getUserData
import { getUserData } from "../../methods/getUserData";
// Import Client and CommandInteraction
import { Client, CommandInteraction } from "discord.js";
// Import ShopItem
import { ShopItem } from "../../types/ShopItemData";
import { InventoryItemData } from "../../types/InventoryItemData";

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("buy")
    // Set command description
    .setDescription("Buy an item from the shop.")
    // Add string option
    .addStringOption((option) =>
      option
        // Set option name
        .setName("item")
        // Set option description
        .setDescription("The item you want to buy.")
        // Set option required
        .setRequired(true),
    )
    // Add integer option
    .addIntegerOption((option) =>
      option
        // Set option name
        .setName("amount")
        // Set option description
        .setDescription("The amount of the item you want to buy.")
        // Set option required
        .setRequired(true),
    ),
  // Set command category
  category: "Economics",
  // Execute function
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get user data
    const user = await getUserData(interaction, client.db, interaction.user.id, interaction.guild!.id);
    // Get item
    const item = interaction.options.getString("item");
    // Get amount
    const amount = interaction.options.getInteger("amount")!;

    // Check if amount is 0 or less
    if (amount <= 0) {
      // Send error message
      await interaction.reply(`You can't buy 0 ${item}s. The universe is not infinite. Get your head out of the clouds.`);
      // Return
      return;
    }

    // Get item from shop
    const shopItem: Array<ShopItem> = await client.db("officialShop").select("*").where("itemName", item);

    // Check if item exists
    if (!shopItem) {
      // Reply with error
      return interaction.reply("That item doesn't exist in the shop.\nUse `/shop` to see all items.");
    }
    // Check if user has enough money
    if (Number(user.coin) < Number(shopItem[0].itemPrice * amount)) {
      // Reply with error
      return interaction.reply(
        `You need more ${Number(shopItem[0].itemPrice) - Number(user.coin)} coins to buy this item.`,
      );
    }

    // Update user data
    await client
      .db("user")
      .where("userId", interaction.user.id)
      .andWhere("serverId", <string>interaction.guild!.id)
      .update({
        coin: Number(user.coin) - Number(shopItem[0].itemPrice) * amount,
      });

    // Check if user has item
    if (user.inventory.items.findIndex((i: InventoryItemData) => i.name === shopItem[0].itemName)) {
      // Update items amount
      user.inventory.items[user.inventory.items.findIndex((i: InventoryItemData) => i.name === shopItem[0].itemName)].amount += amount;
    } else {
      // Add to inventory
      user.inventory.items.push({
        amount,
        description: shopItem[0].itemDescription,
        emoji: shopItem[0].itemEmoji,
        id: shopItem[0].itemId,
        name: shopItem[0].itemName,
        rarity: shopItem[0].itemRarity,
        type: shopItem[0].itemType,
        usable: shopItem[0].usable,
      });
    }

    // Save user data
    await client.db("user").where("userId", interaction.user.id).andWhere("serverId", <string>interaction.guild!.id).update({
      inventory: user.inventory,
    });

    // Reply with success
    return interaction.reply(`You bought ${shopItem[0].itemName} for ${Number(shopItem[0].itemPrice) * amount} coins.`);
  },
};