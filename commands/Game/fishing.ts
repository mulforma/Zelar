import { SlashCommandBuilder } from "@discordjs/builders";
import { getUserData } from "../../methods/getUserData.js";
import ms from "ms";
import { checkTimeout } from "../../methods/checkTimeout.js";
import { Client, CommandInteraction } from "discord.js";
import { InventoryItemData } from "../../types/InventoryItemData";
import { prisma } from "../../database/connect.js";

export default {
  data: new SlashCommandBuilder().setName("fishing").setDescription("Go fishing!"),
  category: "Game",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get user
    const userData = await getUserData(interaction, interaction.user.id, interaction.guild!.id);
    // Set timeout data to be 2 minutes
    const timeout = ms("2m");

    // Check if user is in timeout
    if (await checkTimeout(interaction, "fishing", timeout, userData)) {
      return;
    }

    // 45% Chance of getting a fish if with fishing rod, 15% chance if with no fishing rod
    if (
      Math.floor(Math.random() * 100) <=
      (userData.inventory.items.findIndex((i: InventoryItemData) => i.name === "Fishing Rod") === -1 ? 45 : 15)
    ) {
      // Get fish
      const allFish = await prisma.globalItems.findMany({
        where: {
          itemType: "Collectable.Fish",
        },
      });
      // Get random fish
      const fish = allFish[~~(Math.random() * allFish.length)];
      // Send message
      await interaction.reply(`🎉 You caught a ${fish.itemName}!`);
      // Check if user has this fish in inventory, If yes, add 1 to amount
      if (
        userData.inventory.items.findIndex((i: InventoryItemData) => i.id.toString() === fish.itemId.toString()) !== -1
      ) {
        // Add 1 to amount
        userData.inventory.items[
          userData.inventory.items.findIndex((i: InventoryItemData) => i.id.toString() === fish.itemId.toString())
        ].amount += 1;
      } else {
        // Add fish to inventory
        userData.inventory.items.push({
          id: fish.itemId,
          amount: 1,
          name: fish.itemName,
          type: fish.itemType,
          description: fish.itemDescription,
          emoji: fish.itemEmoji,
          rarity: fish.itemRarity,
          usable: fish.usable,
        });
      }

      // Save user data
      await prisma.user.updateMany({
        where: {
          userId: BigInt(interaction.user.id),
          serverId: BigInt(interaction.guild!.id),
        },
        data: {
          inventory: userData.inventory,
        },
      });
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
