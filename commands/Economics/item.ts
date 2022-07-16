import { SlashCommandBuilder } from "@discordjs/builders";
import { getItemData } from "../../methods/getItemData.js";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("item")
    .setDescription("Get information about an item.")
    .addStringOption((option) => option.setName("item").setDescription("The name of the item.").setRequired(true)),
  category: "Economics",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
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
    const embed = new MessageEmbed()
      // Set title
      .setTitle(`${itemData.itemEmoji} ${itemData.itemName}`)
      // Add field
      .addField("Description", itemData.itemDescription!, true)
      .addField("ID", String(itemData.itemId), true)
      .addField("Type", String(itemData.itemType), true)
      .addField("Rarity", String(itemData.itemRarity), true)
      .addField("Price", String(itemData.price), true)
      .addField("Icon", itemData.itemEmoji!, true)
      .addField("Usable?", itemData.usable!.toString(), true)
      .addField("Sellable?", itemData.sellable!.toString(), true)
      // Set color
      .setColor("BLUE");
    // Send embed
    await interaction.reply({ embeds: [embed] });
  },
};
