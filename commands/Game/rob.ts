import { SlashCommandBuilder } from "@discordjs/builders";
import { getUserData } from "../../methods/getUserData.js";
import { addCoin } from "../../methods/addCoin.js";
import { checkTimeout } from "../../methods/checkTimeout.js";
import ms from "ms";
import { Client, CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("rob")
    .setDescription("Rob someone")
    .addUserOption((option) =>
      option.setName("target").setDescription("The target user you want to rob").setRequired(true),
    ),
  category: "Game",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get target user
    const target = interaction.options.getUser("target")!;
    // Check if target is not command author
    if (target.id === interaction.user.id) {
      // Send error message
      await interaction.reply("You can't rob yourself, you're a good person");
      // Return
      return;
    }
    // Get user data
    const userData = await getUserData(interaction, client.db, interaction.user.id, interaction.guild!.id);
    // Get target user data
    const targetData = await getUserData(interaction, client.db, target.id, interaction.guild!.id);
    // Set timeout data to be 5 minutes
    const timeout = ms("5m");

    await checkTimeout(interaction, client.db, "rob", timeout, userData);

    // Check if target user has enough coins
    if (Number(targetData.coin) < 100) {
      // Send error message
      return interaction.reply("Oops! They are too poor to rob!");
    }

    // 30% chance to rob successfully
    if (Math.random() < 0.3) {
      // Generate random percentage between 10% and 40%
      const percentage = Math.random() * 30 + 10;
      // Calculate amount of coins to rob
      const amount = Math.floor(targetData.coin * (percentage / 100));
      // Add coins to user
      await addCoin(interaction, client.db, interaction.user.id, interaction.guild!.id, amount);
      // Remove coins from target
      await addCoin(interaction, client.db, target.id, interaction.guild!.id, amount * -1);
      // Send success message
      return interaction.reply(`You robbed ${target.username} for ${amount} coins!`);
    }
    // Generate random percentage between 10% and 30%
    const percentage = Math.random() * 20 + 10;
    // Calculate amount of coins to rob
    const amount = Math.floor(targetData.coin * (percentage / 100));
    // Remove coins from user
    await addCoin(interaction, client.db, interaction.user.id, interaction.guild!.id, amount * -1);
    // Send fail message
    return interaction.reply(`Oh no! You got caught! You lost ${amount} coins!`);
  },
};
