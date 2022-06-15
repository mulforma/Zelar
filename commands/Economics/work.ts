import { SlashCommandBuilder } from "@discordjs/builders";
import { getUserData } from "../../methods/getUserData.js";
import { checkTimeout } from "../../methods/checkTimeout.js";
import ms from "ms";
import { Client, CommandInteraction } from "discord.js";
import { TimeoutCommandData } from "../../types/UserData";
import { prisma } from "../../database/connect.js";

export default {
  data: new SlashCommandBuilder().setName("work").setDescription("Work to earn ez money"),
  category: "Economics",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get userData
    const userData = await getUserData(interaction, interaction.user.id, interaction.guild!.id);

    // 6 hours in milliseconds
    const sixHours = ms("6h");
    // Check if user has a timeout
    if (await checkTimeout(interaction, "work", sixHours, userData)) {
      return;
    }
    // Check if user has a job
    if (!userData.jobs) {
      // Send error message
      return interaction.reply("You don't have a job!\nType`/jobs` to see all jobs");
    }
    // Get job
    const job = await prisma.jobs.findFirst({
      where: {
        name: userData.jobs,
      },
    });
    // Check if job exists
    if (!job) {
      // Send error message
      return interaction.reply("What!? This job doesn't exist! Reassign it with `/jobs`");
    }
    // Add job income to user money
    userData.coin += job.income;
    // Check if user already has a timeout
    if (userData.timeout.commands.findIndex((i: TimeoutCommandData) => i.command === "work") !== -1) {
      // Update timeout
      userData.timeout.commands[
        userData.timeout.commands.findIndex((i: TimeoutCommandData) => i.command === "work")
      ].timeout = Date.now();
    }

    // Add timeout
    userData.timeout.commands.push({
      command: "work",
      timeout: Date.now(),
    });
    // Update user data
    await prisma.user.updateMany({
      where: {
        userId: BigInt(interaction.user.id),
        serverId: BigInt(interaction.guild!.id),
      },
      data: {
        coin: userData.coin,
        timeout: userData.timeout,
      },
    });

    // Send success message
    await interaction.reply(`You worked as **${job.name}** and earned ${job.income}, ez money!`);
  },
};
