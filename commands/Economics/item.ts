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
    const itemData = await getItemData(client.db, "itemName", itemName!);
    // Check if item data is empty array
    if (itemData.length === 0) {
      // Send error message
      await interaction.reply("Item not found.");
      // Return
      return;
    }
    // Create embed
    const embed = new MessageEmbed()
      // Set title
      .setTitle(`${itemData[0].itemEmoji} ${itemData[0].itemName}`)
      // Set Thumbnail
      .setThumbnail(client.user!.displayAvatarURL())
      // Add field
      .addField("Description", itemData[0].itemDescription, true)
      .addField("ID", String(itemData[0].itemId), true)
      .addField("Type", String(itemData[0].itemType), true)
      .addField("Rarity", String(itemData[0].itemRarity), true)
      .addField("Price", String(itemData[0].price), true)
      .addField("Icon", itemData[0].itemEmoji, true)
      .addField("Usable?", itemData[0].usable!.toString(), true)
      .addField("Sellable?", itemData[0].sellable!.toString(), true)
      // Set color
      .setColor("BLUE");
    // Send embed
    await interaction.reply({ embeds: [embed] });
  },
};
