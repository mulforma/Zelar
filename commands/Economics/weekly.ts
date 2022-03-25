// Import SlashCommandBuilder
import { SlashCommandBuilder } from "@discordjs/builders";
// Import getUserData
import { getUserData } from "../../methods/getUserData";
// Import addCoin
import { addCoin } from "../../methods/addCoin";
// Import Client, CommandInteraction
import { Client, CommandInteraction } from "discord.js";
// Import ms
import ms from "ms";

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("weekly")
    // Set command description
    .setDescription("Get your weekly coin."),
  // Set command category
  category: "Economics",
  // Execute function
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get user data
    const userData = await getUserData(interaction, client.db, interaction.user.id, interaction.guild!.id);
    // Get user daily coins time
    const lastWeekly = Number(userData.timeout.weekly);
    // Get current date
    const currentDate = new Date().getTime();
    // Weekly coin amount
    const weeklyAmount = 3000;
    // Week in milliseconds
    const week = 604800000;

    // If user lasted weekly coin time is less than a day
    if (currentDate - lastWeekly < week) {
      // Send message
      await interaction.reply(
        `You already got your weekly coins.\nYou can get your coins again in ${ms(week - (currentDate - lastWeekly))}`,
      );
    } else {
      // Add daily coins
      await addCoin(interaction, client.db, interaction.user.id, interaction.guild!.id, weeklyAmount);
      // Set new daily time
      userData.timeout.weekly = currentDate;
      // Save user data
      await client
        .db("user")
        .update("timeout", userData.timeout)
        .where("userId", interaction.user.id)
        .where("serverId", <string>interaction.guild!.id);
      // Send message
      await interaction.reply(
        `You got ${weeklyAmount} coins.\nNow you have ${Number(userData.coin) + weeklyAmount} coins.`,
      );
    }
  },
};
