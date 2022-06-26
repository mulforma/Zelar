import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import { getUserData } from "../../methods/getUserData.js";
import { checkTimeout } from "../../methods/checkTimeout.js";
import { TimeoutCommandData } from "../../types/UserData";
import { prisma } from "../../prisma/connect.js";
import ms from "ms";

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
    const user = await getUserData(interaction, interaction.user.id, interaction.guild!.id);
    // Get all jobs
    const jobs = await prisma.jobs.findMany();
    // Check if job is exists
    if (!job) {
      // Create embed
      const embed = new MessageEmbed()
        // Set title
        .setTitle("Jobs")
        .setDescription(
          jobs
            .map(
              (j: any) =>
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
      if (!jobs.find((j: any) => j.name.toLowerCase() === job.toLowerCase())) {
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
        if (
          Number(user.level) < Number(jobs.find((j: any) => j.name.toLowerCase() === job.toLowerCase())!.minimumLevel)
        ) {
          // Create embed
          const embed = new MessageEmbed()
            // Set title
            .setTitle("Jobs")
            .setDescription(
              `You need to be at least level ${
                jobs.find((j: any) => j.name.toLowerCase() === job.toLowerCase())!.minimumLevel
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
          if (await checkTimeout(interaction, "jobs", week, user)) {
            return;
          }
          // Update user job
          await prisma.user.updateMany({
            where: {
              userId: BigInt(interaction.user.id),
            },
            data: {
              jobs: job,
            },
          });
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
          if (user.timeout.commands.findIndex((x: TimeoutCommandData) => x.command === "jobs") !== -1) {
            // Update timeout
            user.timeout.commands[
              user.timeout.commands.findIndex((x: TimeoutCommandData) => x.command === "jobs")
            ].time = Date.now();
          } else {
            // Add timeout
            user.timeout.commands.push({ command: "jobs", time: Date.now() });
          }

          // Update user timeout
          await prisma.user.updateMany({
            where: {
              userId: BigInt(interaction.user.id),
            },
            data: {
              timeout: user.timeout,
            },
          });
        }
      }
    }
  },
};
