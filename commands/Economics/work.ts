import { SlashCommandBuilder } from "@discordjs/builders";
import { getUserData } from "../../methods/getUserData.js";
import { checkTimeout } from "../../methods/checkTimeout.js";
import ms from "ms";
import { Client, CommandInteraction } from "discord.js";
import { TimeoutCommandData } from "../../types/UserData";

export default {
  data: new SlashCommandBuilder().setName("work").setDescription("Work to earn ez money"),
  category: "Economics",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get userData
    const userData = await getUserData(interaction, client.db, interaction.user.id, interaction.guild!.id);
    // 6 hours in milliseconds
    const sixHours = ms("6h");
    // Check if user has a timeout
    if (await checkTimeout(interaction, client.db, "work", sixHours, userData)) {
      return;
    }
    // Check if user has a job
    if (!userData.jobs) {
      // Send error message
      return interaction.reply("You don't have a job!\nType`/jobs` to see all jobs");
    }
    // Get job
    const job = await client.db.select("*").from("jobs").where("name", userData.jobs);
    // Check if job exists
    if (!job.length) {
      // Send error message
      return interaction.reply("What!? This job doesn't exist! Reassign it with `/jobs`");
    }
    // Get job data
    const [jobData] = job;
    // Add job income to user money
    userData.coin += jobData.income;
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
    client
      .db("users")
      .update({
        coin: userData.coin,
        timeout: userData.timeout,
      })
      .where({
        userId: interaction.user.id,
        serverId: interaction.guild!.id,
      });
    // Send success message
    await interaction.reply(`You worked as **${jobData.name}** and earned ${jobData.income}, ez money!`);
  },
};
