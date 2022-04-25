import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask the magic 8ball a question!")
    .addStringOption(option =>
      option.setName("question").setRequired(true).setDescription("The question to ask the 8ball")
    ),
  category: "Fun",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Define answer array
    const answer = ["No way", "No", "Maybe", "Yes", "Definitely"];
    // Get the question
    const question = interaction.options.getString("question");
    // Get the result
    const result = answer[Math.ceil(Math.random() * answer.length)];
    // Send the message
    await interaction.reply({
      content: `:crystal_ball: Question: ${question}\n:comet: Answer: ${result}`,
    });
  },
};
