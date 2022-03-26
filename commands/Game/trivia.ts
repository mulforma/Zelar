import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import {
  Client,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
} from "discord.js";
import log from "npmlog";

export default {
  data: new SlashCommandBuilder().setName("trivia").setDescription("You have 30 seconds to think, Quick!"),
  category: "Game",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Fetch trivia from API
    const response = await axios.get("https://opentdb.com/api.php?amount=1&type=boolean&encode=base64");
    // Set random coin amount
    const randCoin = Math.floor(Math.random() * 30) + 1;

    // Create embed
    const embed = new MessageEmbed()
      // Set title
      .setTitle(Buffer.from(response.data.results[0].question.toString(), "base64").toString())
      // Set color
      .setColor("RANDOM")
      // Set timestamp
      .setTimestamp()
      // Set footer
      .setFooter({
        text: `Request by ${interaction.user.tag}`,
        iconURL: interaction.user.avatarURL()!,
      })
      // Add field category
      .addField("Category", Buffer.from(response.data.results[0].category.toString(), "base64").toString(), true)
      // Add field difficulty
      .addField("Difficulty", Buffer.from(response.data.results[0].difficulty.toString(), "base64").toString(), true);

    // Add answer buttons
    const btn = new MessageActionRow().addComponents(
      new MessageButton()
        // Set id
        .setCustomId("true")
        // Set text
        .setLabel("True")
        // Set color style
        .setStyle("SUCCESS"),
      new MessageButton()
        // Set id
        .setCustomId("false")
        // Set text
        .setLabel("False")
        // Set color style
        .setStyle("DANGER"),
    );

    // Send embed and buttons
    await interaction.reply({ embeds: [embed], components: [btn] });

    // Filter for answer buttons
    const filter = (i: MessageComponentInteraction) =>
      // Check if id is true or false and if it is the same user
      (i.customId === "false" || i.customId === "true") && i.user.id === interaction.user.id;

    // Wait for answer
    const collector = interaction.channel!.createMessageComponentCollector({
      // Filter for answer buttons
      filter,
      // Timeout for answer
      time: 30000,
    });

    // When answer is received
    collector.on("collect", async (i) => {
      try {
        // Check if answer is true or false
        await i.deferUpdate();
      } catch (e) {
        // If answer is not true or false
        log.error("Error: ", <string>e);
      }

      // Correct answer
      const correctAnswer = Buffer.from(response.data.results[0].correct_answer, "base64").toString();

      // Check if answer is correct
      if (i.customId.toLowerCase() === correctAnswer.toLowerCase()) {
        // Send congrats message
        await i.editReply({
          content: `🎉 Hooray! That's the correct answer!\nYou won **${randCoin} coins!**`,
          components: [],
          embeds: [],
        });
        // Add coins
        client.db
          .select("coin")
          .from("user")
          .where("userId", interaction.user.id)
          .andWhere("serverId", <string>interaction.guild!.id)
          .then(async (row) => {
            if (!row[0]) {
              return;
            }
            // Set coins
            const coins = Number(row[0].coin || 0) + randCoin;

            // Update coins
            await client
              .db("user")
              .where("userId", interaction.user.id)
              .andWhere("serverId", <string>interaction.guild!.id)
              .update({ coin: coins });
          });
      }

      // If answer is incorrect
      else if (i.customId.toLowerCase() !== correctAnswer.toLowerCase()) {
        // Send sorry message
        await i.editReply({
          content: `😢 Oh no! That's the wrong answer!\nThe correct answer is ${correctAnswer}`,
          components: [],
          embeds: [],
        });
      }
    });
  },
};
