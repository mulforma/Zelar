import { SlashCommandBuilder } from "@discordjs/builders";
import { getUserData } from "../../methods/getUserData.js";
import { addCoin } from "../../methods/addCoin.js";
import { Client, CommandInteraction } from "discord.js";
import ms from "ms";
import { prisma } from "../../prisma/connect.js";

export default {
  data: new SlashCommandBuilder().setName("weekly").setDescription("Get your weekly coin."),
  category: "Economics",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get user data
    const userData = await getUserData(interaction, interaction.user.id, interaction.guild!.id);
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
      await addCoin(interaction, interaction.user.id, interaction.guild!.id, weeklyAmount);
      // Set new daily time
      userData.timeout.weekly = currentDate;
      // Save user data
      await prisma.user.updateMany({
        where: {
          userId: interaction.user.id,
          serverId: interaction.guild!.id,
        },
        data: {
          timeout: userData.timeout,
        },
      });

      // Send message
      await interaction.reply(
        `You got ${weeklyAmount} coins.\nNow you have ${Number(userData.coin) + weeklyAmount} coins.`,
      );
    }
  },
};
