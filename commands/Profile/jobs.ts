import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { getUserData } from "../../methods/getUserData.js";
import { checkTimeout } from "../../methods/checkTimeout.js";
import ms from "ms";
import { TimeoutCommandData } from "../../types/UserData";

export default {
  data: new SlashCommandBuilder()
    .setName("jobs")
    .setDescription("Choose a job")
    .addStringOption((option) => option.setName("job").setDescription("The job you want to choose").setRequired(false)),
  category: "Profile",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Go get a job
    const job = interaction.options.getString("job");
    // Get user data
    const user = await getUserData(interaction, client.db, interaction.user.id, interaction.guild?.id ?? "");
    // Get all jobs
    const jobs = await client.db.select("*").from("jobs");
    // Check if job is exists
    if (!job) {
      // Create embed
      const embed = new MessageEmbed()
        // Set title
        .setTitle("Jobs")
        .setDescription(
          jobs
            .map(
              (j) =>
                `${Number(user.level) < Number(j.minimumLevel) ? "🔒" : "✅"} **${j.name}** - *${
                  j.description
                }*\nIncome: $${j.income}`,
            )
            .join("\n\n"),
        )
        // Set color
        .setColor("RED");
      // Send embed
      await interaction.reply({ embeds: [embed] });
    } else {
      // Check if job is valid
      if (!jobs.find((j) => j.name.toLowerCase() === job.toLowerCase())) {
        // Create embed
        const embed = new MessageEmbed()
          // Set title
          .setTitle("Jobs")
          .setDescription(`The job **${job}** does not exist!`)
          // Set color
          .setColor("RED");
        // Send embed
        await interaction.reply({ embeds: [embed] });
      } else {
        // Check if user has enough level
        if (Number(user.level) < Number(jobs.find((j) => j.name.toLowerCase() === job.toLowerCase()).minimumLevel)) {
          // Create embed
          const embed = new MessageEmbed()
            // Set title
            .setTitle("Jobs")
            .setDescription(
              `You need to be at least level ${
                jobs.find((j) => j.name.toLowerCase() === job.toLowerCase()).minimumLevel
              } to choose this job!`,
            )
            // Set color
            .setColor("RED");
          // Send embed
          await interaction.reply({ embeds: [embed] });
          // Check if user already choose this job
        } else if (user.job === job) {
          // Create embed
          const embed = new MessageEmbed()
            // Set title
            .setTitle("Jobs")
            .setDescription("You already choose this job!")
            // Set color
            .setColor("RED");
          // Send embed
          await interaction.reply({ embeds: [embed] });
        } else {
          // One week in milliseconds
          const week = ms("7d");
          // Check user timeout
          if (await checkTimeout(interaction, client.db, "jobs", week, user)) {
            return;
          }
          // Update user job
          await client.db("user").update({ jobs: job }).where({ userId: interaction.user.id });
          // Create embed
          const embed = new MessageEmbed()
            // Set title
            .setTitle("Jobs")
            .setDescription(`You have chosen the job **${job}**!`)
            // Set color
            .setColor("RED");
          // Send embed
          await interaction.reply({ embeds: [embed] });

          // Check if user already has timeout
          if (user.timeout.findIndex((x: TimeoutCommandData) => x.command === "jobs") !== -1) {
            // Update timeout
            user.timeout[user.timeout.findIndex((x: TimeoutCommandData) => x.command === "jobs")].time = Date.now();
          } else {
            // Add timeout
            user.timeout.push({ command: "jobs", time: Date.now() });
          }

          // Update user timeout
          await client.db("user").update({ timeout: user.timeout }).where({ userId: interaction.user.id });
        }
      }
    }
  },
};
