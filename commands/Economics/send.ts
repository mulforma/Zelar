import { SlashCommandBuilder } from "@discordjs/builders";
import { getUserData } from "../../methods/getUserData.js";
import { checkTimeout } from "../../methods/checkTimeout.js";
import { Client, CommandInteraction } from "discord.js";
import { InventoryItemData } from "../../types/InventoryItemData";
import { prisma } from "../../prisma/connect.js";
import ms from "ms";

export default {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("Send user an item, Even if they want it or not.")
    .addUserOption((option) =>
      option.setName("target").setDescription("The target user you want to send an item").setRequired(true),
    )
    .addStringOption((option) => option.setName("item").setDescription("The item you want to send").setRequired(true))
    .addIntegerOption((option) =>
      option.setName("amount").setDescription("The amount of the item you want to send").setRequired(true),
    ),
  category: "Economics",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get target user
    const target = interaction.options.getUser("target");
    // Get item
    const item = interaction.options.getString("item");
    // Get amount
    const amount = interaction.options.getInteger("amount");
    // Check if target is not command author
    if (target!.id === interaction.user.id) {
      // Send error message
      interaction.channel!.send("You can't send yourself an item, Why would you do that?");
      // Return
      return;
    }

    // Get user data
    const userData = await getUserData(interaction, interaction.user.id, interaction.guild!.id);
    // Get target user data
    const targetData = await getUserData(interaction, target!.id, interaction.guild!.id);
    // Find user items
    const userItems = userData.inventory.items.find((x: InventoryItemData) => x.name === item);
    // Check if user has items
    if (!userItems) {
      // Send error message
      interaction.channel!.send(`What are you trying to send ${target!.username}? You don't have any ${item}!`);
      // Return
      return;
    }
    // Check if user has enough items
    if (userItems.amount < amount!) {
      // Send error message
      interaction.channel!.send(`You don't have enough ${item} to send ${amount} to ${target!.username}`);
      // Return
      return;
    }

    // Set timeout data to be 1 minutes
    const timeout = ms("1m");

    // Check timeout
    if (await checkTimeout(interaction, "send", timeout, userData)) {
      return;
    }

    // Check if target already has item
    const targetItems = targetData.inventory.items.find((x: InventoryItemData) => x.name === item);
    // Check if target has item
    if (targetItems) {
      // Add amount to target item
      targetItems.amount += amount;
    } else {
      // Add item to target inventory
      targetData.inventory.items.push({
        name: item,
        amount,
      });
    }
    // Remove amount from user item
    userItems.amount -= amount!;
    // Check if user item amount is 0
    if (userItems.amount === 0) {
      // Remove item from user inventory
      userData.inventory.items.splice(userData.inventory.items.indexOf(userItems), 1);
    }
    // Update user data
    await prisma.user.updateMany({
      where: {
        userId: BigInt(interaction.user.id),
        serverId: BigInt(interaction.guild!.id),
      },
      data: {
        inventory: userData.inventory,
      },
    });

    // Update target data
    await prisma.user.updateMany({
      where: {
        userId: BigInt(target!.id),
        serverId: BigInt(interaction.guild!.id),
      },
      data: {
        inventory: targetData.inventory,
      },
    });

    // Send success message
    await interaction.reply(`Successfully sent ${amount} ${item} to ${target!.username}`);
  },
};
