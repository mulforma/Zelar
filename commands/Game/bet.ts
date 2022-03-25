// Import SlashCommandBuilder
import { SlashCommandBuilder } from "@discordjs/builders";
// Import getUserData
import { getUserData } from "../../methods/getUserData";
// Import addCoin
import { addCoin } from "../../methods/addCoin";
// Import Client and CommandInteraction
import { Client, CommandInteraction } from "discord.js";

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("bet")
    // Set command description
    .setDescription("Bet on a game.")
    // Add integer option
    .addIntegerOption((option) =>
      option
        // Set option name
        .setName("amount")
        // Set option description
        .setDescription("The amount to bet.")
        // Set option required
        .setRequired(true),
    )
    // Add integer option
    .addIntegerOption((option) =>
      option
        // Set option name
        .setName("number")
        // Set option description
        .setDescription("The number to bet (1-10).")
        // Set option required
        .setRequired(true),
    ),
  // Set command category
  category: "Game",
  // Execute function
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get random number
    const number = Math.floor(Math.random() * 10) + 1;
    // Get amount
    const amount = interaction.options.getInteger("amount")!;
    // Get user
    const user = await getUserData(interaction, client.db, interaction.user.id, interaction.guild!.id);
    // Check if user has enough money
    if (user.coin < amount) {
      // Send error message
      return interaction.reply(`You don't have enough money to bet ${amount}`);
    }

    // Check if number is valid
    if (interaction.options.getInteger("number")! < 1 || interaction.options.getInteger("number")! > 10) {
      // Send error message
      return interaction.reply("The number must be between 1 and 10.");
    }

    // Check if bet number is equal to random number
    if (interaction.options.getInteger("number") === number) {
      // Add money to user
      await addCoin(interaction, client.db, interaction.user.id, interaction.guild!.id, amount * 2);
      // Send success message
      return interaction.reply(`🎉 Congratulations! You won ${amount * 2} coins!`);
    }

    // Subtract money from user
    await addCoin(interaction, client.db, interaction.user.id, interaction.guild!.id, amount * -1);
    // Send error message
    return interaction.reply(`😭 You lost ${amount} coins.`);
  },
};