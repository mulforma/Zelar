// Import SlashCommandBuilder
import { SlashCommandBuilder } from "@discordjs/builders";
// Import axios
import axios from "axios";
// Import MessageEmbed
import { Message, MessageEmbed } from "discord.js";
// Import addCoin
import { addCoin } from "../../methods/addCoin";
// Import Client, CommandInteraction
import { Client, CommandInteraction } from "discord.js";

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("fast")
    // Set command description
    .setDescription("Answers with a fast response.")
    // Add subcommand
    .addSubcommand((subcommand) =>
      subcommand
        // Set subcommand name
        .setName("math")
        // Set subcommand description
        .setDescription("Answers math questions."),
    ),
  // Set command category
  category: "Fun",
  // Execute function
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Set if end
    let end = false;
    // Generate random coin amount between 200 - 250
    const amount = Math.floor(Math.random() * (250 - 200 + 1)) + 200;
    // Filter message
    const filter = (message: Message) => {
      return !message.author.bot && message.author.id === interaction.user.id;
    };
    // Wait for message
    const collector = await interaction.channel!.createMessageCollector({ filter, time: 10000 });
    // Get subcommand
    const subcommand = interaction.options.getSubcommand();
    // Switch subcommand
    switch (subcommand) {
      // If subcommand is math
      case "math":
        // Fetch math questions
        const { data } = await axios.get(
          "https://opentdb.com/api.php?amount=1&category=19&type=multiple&encode=base64",
        );
        // Get result
        const [results] = data.results;
        // Get question
        const { question, correct_answer: correctAnswer } = results;
        // Get answers
        const answers = results.incorrect_answers.map((answer: string) => Buffer.from(answer, "base64").toString());
        // Add correct answer
        answers.push(Buffer.from(correctAnswer, "base64").toString());
        // Send question
        await interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(Buffer.from(question, "base64").toString())
              .setDescription("You have 10 seconds to answer.")
              .addField("Answers", answers.join("\n"))
              .setColor("#00FF00")
              .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
              .setThumbnail(client.user!.displayAvatarURL()),
          ],
        });
        collector.on("collect", (collected) => {
          // Get message
          const guess = collected.content.toLowerCase();
          // If guess is correct
          if (guess === Buffer.from(correctAnswer, "base64").toString().toLowerCase()) {
            // Set end
            end = true;
            // Send message
            interaction.channel!.send(`🎉 Correct! You won ${amount} coins!`);
            // Add coins
            addCoin(interaction, client.db, interaction.user.id, interaction.guild!.id, amount);
            // End collector
            collector.stop();
          } else {
            // Set end
            end = true;
            // Send message
            interaction.channel!.send(
              `❌ Incorrect! The correct answer was ${Buffer.from(correctAnswer, "base64").toString()}.`,
            );
          }
        });
        // On collector end
        collector.on("end", () => {
          // If not correct
          if (!end) {
            // Send message
            interaction.channel!.send(
              `⏰ Time's up! The correct answer was **${Buffer.from(correctAnswer, "base64").toString()}**.`,
            );
          }
        });
        break;
      default:
        break;
    }
  },
};
