import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { Client, CommandInteraction, Message, MessageEmbed } from "discord.js";
import { addCoin } from "../../methods/addCoin.js";

export default {
  data: new SlashCommandBuilder()
    .setName("fast")
    .setDescription("Answers with a fast response.")
    .addSubcommand((subcommand) => subcommand.setName("math").setDescription("Answers math questions.")),
  category: "Fun",
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
        collector.on("collect", async (collected) => {
          // Get message
          const guess = collected.content.toLowerCase();
          // If guess is correct
          if (guess === Buffer.from(correctAnswer, "base64").toString().toLowerCase()) {
            // Set end
            end = true;
            // Send message
            interaction.channel!.send(`🎉 Correct! You won ${amount} coins!`);
            // Add coins
            await addCoin(interaction, client.db, interaction.user.id, interaction.guild!.id, amount);
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
