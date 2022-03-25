// Import SlashCommandBuilder
import { SlashCommandBuilder } from "@discordjs/builders";
// Import getUserData
import { getUserData } from "../../methods/getUserData";
// Import addCoin
import { addCoin } from "../../methods/addCoin";
// Import ms
import ms from "ms";
import { Client, CommandInteraction } from "discord.js";

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("daily")
    // Set command description
    .setDescription("Get your daily coin."),
  // Set command category
  category: "Economics",
  // Execute function
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get user data
    const userData = await getUserData(interaction, client.db, interaction.user.id, interaction.guild!.id);
    // Get user daily coins time
    const lastDaily = Number(userData.timeout.daily);
    // Get current date
    const currentDate = new Date().getTime();
    // Daily coin amount
    const dailyAmount = 300;
    // Day in milliseconds
    const day = 86400000;

    // If user lasted daily coin time is less than a day
    if (currentDate - lastDaily < day) {
      // Send message
      await interaction.reply(
        `You already got your daily coins!\nYou can get them again in ${ms(day - (currentDate - lastDaily))}`,
      );
    } else {
      // Add daily coins
      await addCoin(interaction, client.db, interaction.user.id, interaction.guild!.id, dailyAmount);
      // Set new daily time
      userData.timeout.daily = currentDate;
      // Save user data
      await client
        .db("user")
        .update("timeout", userData.timeout)
        .where("userId", interaction.user.id)
        .andWhere("serverId", <string>interaction.guild!.id);
      // Send message
      await interaction.reply(
        `You got ${dailyAmount} coins.\nNow you have ${Number(userData.coin) + dailyAmount} coins.`,
      );
    }
  },
};
