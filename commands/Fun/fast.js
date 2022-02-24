// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import axios
const axios = require("axios");
// Import MessageEmbed
const { MessageEmbed } = require("discord.js");
const addCoin = require("../../function/addCoin");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("fast")
    // Set command description
    .setDescription("Answers with a fast response.")
    // Add subcommand
    .addSubcommand(subcommand =>
      subcommand
        // Set subcommand name
        .setName("math")
        // Set subcommand description
        .setDescription("Answers math questions.")
    ),
  // Set command category
  category: "Fun",
  // Execute function
  /**
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute (client, interaction) {
    // Set if end
    let end = false;
    // Generate random coin amount between 200 - 250
    const amount = Math.floor(Math.random() * (250 - 200 + 1)) + 200;
    // Filter message
    const filter = (message) => {
      return !message.author.bot && message.author.id === interaction.user.id;
    };
    // Wait for message
    const collector = await interaction.channel.createMessageCollector({ filter, time: 10000 });
    // Get subcommand
    const subcommand = interaction.options.getSubcommand();
    // Switch subcommand
    switch (subcommand) {
      // If subcommand is math
      case "math":
        // Fetch math questions
        const { data } = await axios.get("https://opentdb.com/api.php?amount=1&category=19&type=multiple&encode=base64");
        // Get question
        const { question, correct_answer: correctAnswer } = data.results[0];
        // Get answers
        const answers = data.results[0].incorrect_answers.map(answer => Buffer.from(answer, "base64").toString());
        // Add correct answer
        answers.push(Buffer.from(correctAnswer, "base64").toString());
        // Send question
        interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(Buffer.from(question, "base64").toString())
              .setDescription("You have 10 seconds to answer.")
              .addField("Answers", answers.join("\n"))
              .setColor("#00FF00")
              .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
              .setThumbnail(client.user.displayAvatarURL())
          ]
        })
        collector.on("collect", (collected) => {
          // Get message
          const guess = collected.content.toLowerCase();
          // If guess is correct
          if (guess === Buffer.from(correctAnswer, "base64").toString().toLowerCase()) {
            // Set end
            end = true;
            // Send message
            interaction.channel.send(`🎉 Correct! You won ${amount} coins!`);
            // Add coins
            addCoin(interaction, client.db, interaction.user.id, interaction.guild.id, amount);
            // End collector
            collector.stop();
          }  else {
            // Set end
            end = true;
            // Send message
            interaction.channel.send(`❌ Incorrect! The correct answer was ${Buffer.from(correctAnswer, "base64").toString()}.`);
          }
        });
        // On collector end
        collector.on("end", () => {
          // If not correct
          if (!end) {
            // Send message
            interaction.channel.send(`⏰ Time's up! The correct answer was **${Buffer.from(correctAnswer, "base64").toString()}**.`);
          }
        });
    }
  },
};