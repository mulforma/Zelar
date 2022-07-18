import { Colors, SlashCommandBuilder } from "discord.js";
import { getItemData } from "../../methods/getItemData.js";
import { Client, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("item")
    .setDescription("Get information about an item.")
    .addStringOption((option) => option.setName("item").setDescription("The name of the item.").setRequired(true)),
  category: "Economics",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get item name
    const itemName = interaction.options.getString("item");
    // Get item data
    const itemData = await getItemData("itemName", itemName!);
    // Check if item data is empty array
    if (!itemData) {
      // Send error message
      await interaction.reply("Item not found.");
      // Return
      return;
    }
    // Create embed
    const embed = new EmbedBuilder()
      // Set title
      .setTitle(`${itemData.itemEmoji} ${itemData.itemName}`)
      // Add fields
      .addFields([
        { name: "Description", value: itemData.itemDescription!, inline: true },
        { name: "ID", value: String(itemData.itemId), inline: true },
        { name: "Type", value: String(itemData.itemType), inline: true },
        { name: "Rarity", value: String(itemData.itemRarity), inline: true },
        { name: "Price", value: String(itemData.price), inline: true },
        { name: "Icon", value: itemData.itemEmoji!, inline: true },
        { name: "Usable?", value: itemData.usable!.toString(), inline: true },
        { name: "Sellable?", value: itemData.sellable!.toString(), inline: true },
      ])
      // Set color
      .setColor(Colors.Blue);
    // Send embed
    await interaction.reply({ embeds: [embed] });
  },
};
