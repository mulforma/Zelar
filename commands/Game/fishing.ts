// Import SlashCommandBuilder
import { SlashCommandBuilder } from "@discordjs/builders";
// Import getUserData
import { getUserData } from "../../methods/getUserData";
// Import ms
import ms from "ms";
// Import checkTimeout
import { checkTimeout } from "../../methods/checkTimeout";
// Import Client and CommandInteraction
import { Client, CommandInteraction } from "discord.js";
// Import InventoryItemData
import { InventoryItemData } from "../../types/InventoryItemData";

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("fishing")
    // Set command description
    .setDescription("Go fishing!"),
  // Set command category
  category: "Game",
  // Execute function
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get user
    const userData = await getUserData(interaction, client.db, interaction.user.id, interaction.guild!.id);
    // Set timeout data to be 2 minutes
    const timeout = ms("2m");

    // Check if user is in timeout
    if (await checkTimeout(interaction, client.db, "fishing", timeout, userData)) {
      return;
    }

    // 45% Chance of getting a fish if with fishing rod, 15% chance if with no fishing rod
    if (
      Math.floor(Math.random() * 100) <=
      (userData.inventory.items.findIndex((i: InventoryItemData) => i.name === "Fishing Rod") === -1 ? 45 : 15)
    ) {
      // Get random fish
      const fish = await client.db
        .select("*")
        .from("globalItems")
        .where("itemType", "Collectable.Fish")
        .orderByRaw("RANDOM()");
      // Send message
      await interaction.reply(`🎉 You caught a ${fish[0].itemName}!`);
      // Check if user has this fish in inventory, If yes, add 1 to amount
      if (userData.inventory.items.findIndex((i: InventoryItemData) => i.id === fish[0].id) !== -1) {
        // Add 1 to amount
        userData.inventory.items[userData.inventory.items.findIndex((i: InventoryItemData) => i.id === fish[0].id)].amount += 1;
      } else {
        // Add fish to inventory
        userData.inventory.items.push({
          id: fish[0].id,
          amount: 1,
          name: fish[0].itemName,
          type: fish[0].itemType,
          description: fish[0].itemDescription,
          emoji: fish[0].itemEmoji,
          rarity: fish[0].itemRarity,
          usable: fish[0].usable,
        });
      }

      // Save user data
      await client
        .db("user")
        .update("inventory", userData.inventory)
        .where("userId", interaction.user.id)
        .andWhere("serverId", <string>interaction.guild!.id);
    } else {
      // Send message
      await interaction.reply(
        `😢 You didn't catch anything.${
          userData.inventory.items.findIndex((i: InventoryItemData) => i.name === "Fishing Rod") === -1
            ? "\nYou can buy a fishing rod to increase your chance of catching a fish."
            : ""
        }`,
      );
    }
  },
};
