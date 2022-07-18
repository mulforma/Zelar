import { SlashCommandBuilder } from "discord.js";
import { getUserData } from "../../methods/getUserData.js";
import { addCoin } from "../../methods/addCoin.js";
import { Client, ChatInputCommandInteraction } from "discord.js";
import { prisma } from "../../prisma/connect.js";
import ms from "ms";

export default {
  data: new SlashCommandBuilder().setName("daily").setDescription("Get your daily coin."),
  category: "Economics",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get user data
    const userData = await getUserData(interaction, interaction.user.id, interaction.guild!.id);
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
      await addCoin(interaction, interaction.user.id, interaction.guild!.id, dailyAmount);
      // Set new daily time
      userData.timeout.daily = currentDate;
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
        `You got ${dailyAmount} coins.\nNow you have ${Number(userData.coin) + dailyAmount} coins.`,
      );
    }
  },
};
