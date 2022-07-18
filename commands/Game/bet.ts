import { SlashCommandBuilder } from "discord.js";
import { getUserData } from "../../methods/getUserData.js";
import { addCoin } from "../../methods/addCoin.js";
import { Client, ChatInputCommandInteraction } from "discord.js";
import { randomBytes } from "crypto";

export default {
  data: new SlashCommandBuilder()
    .setName("bet")
    .setDescription("Bet on a game.")
    .addNumberOption((option) => option.setName("amount").setDescription("The amount to bet.").setRequired(true))
    .addNumberOption((option) =>
      option.setName("number").setDescription("The number to bet (1-10).").setRequired(true),
    ),
  category: "Game",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get random number
    const number = (randomBytes(1)[0] % 10) + 1;
    // Timestamp
    const timestamp = Date.now();
    // Get amount
    const amount = interaction.options.getNumber("amount")!;
    // Get guess number
    const guess = interaction.options.getNumber("number")!;
    // Get user
    const user = await getUserData(interaction, interaction.user.id, interaction.guild!.id);
    // Check if user has enough money
    if (user.coin < amount) {
      // Send error message
      return interaction.reply(`You don't have enough money to bet ${amount}`);
    }

    // Check if number is valid
    if (amount < 1 || guess > 10 || guess < 1) {
      // Send error message
      return interaction.reply("The number must be between 1 and 10.");
    }

    // Check if bet number is equal to random number
    if (guess === number) {
      // Add money to user
      await addCoin(interaction, interaction.user.id, interaction.guild!.id, amount * 2);
      // Send success message
      return interaction.reply(`🎉 Congratulations! You won ${amount * 2} coins!`);
    }

    // Subtract money from user
    await addCoin(interaction, interaction.user.id, interaction.guild!.id, amount * -1);
    // Send error message
    return interaction.reply(
      `😭 You lost ${amount} coins.\n🔢 The number was: ${number}\n🕐 Generated timestamp: \`${timestamp}\``,
    );
  },
};
