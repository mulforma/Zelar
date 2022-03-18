// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import axios
const axios = require("axios");
// Import addCoin
const addCoin = require("../../methods/addCoin");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("word")
    // Set command description
    .setDescription("Plays a word game.")
    // Add subcommands
    .addSubcommand((subcommand) =>
      subcommand
        // Set subcommand name
        .setName("fill")
        // Set subcommand description
        .setDescription("Fills in the blanks in a word."),
    )
    // Add subcommands
    .addSubcommand((subcommand) =>
      subcommand
        // Set subcommand name
        .setName("sort")
        // Set subcommand description
        .setDescription("Sorts a shuffled word."),
    ),
  // Set command category
  category: "Fun",
  // Execute function
  /**
   * @param {import("discord.js").Client} client
   * @param {import("discord.js").CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    // GenBlanks function (For filling in the blanks)
    function genBlanks(letter) {
      // Make some letters underscores
      const blankLetters = letter.map((letter) => (Math.random() > 0.33 ? letter : "\\_"));
      // Check if word is already filled or none of the letters are revealed
      if (blankLetters.join("") === letter || blankLetters.every((letter) => letter === "\\_")) {
        // Generate new blanks
        genBlanks();
      } else {
        // Return blanks
        return blankLetters;
      }
    }
    // Set tries
    let tries = 0;
    // Set if correct
    let correct = false;
    // Fetch word
    const { data } = await axios.get(
      "https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-no-swears.txt",
    );
    // Filter words that are less than 3 characters
    const words = data.split("\n").filter((word) => word.length > 2);
    // Get random word
    const word = words[Math.floor(Math.random() * words.length)];
    // Get split word
    const letters = word.split("");
    // Filter message
    const filter = (message) => {
      return !message.author.bot && message.author.id === interaction.user.id;
    };
    // Wait for message
    const collector = await interaction.channel.createMessageCollector({ filter, time: 30000 });
    // Generate random coin amount between 100 - 250
    const amount = Math.floor(Math.random() * (250 - 100 + 1)) + 100;
    // Get subcommands
    const subcommands = interaction.options.getSubcommand();
    // Switch subcommands
    switch (subcommands) {
      // If subcommand is fill
      case "fill":
        // Get blanks
        const blanks = genBlanks(letters);
        // Send message
        interaction.reply(`Fill in the blanks!\n\n${blanks.join(" ")}`);
        // On collected message
        collector.on("collect", (collected) => {
          // Get message
          const guess = collected.content.toLowerCase();
          // If guess is correct
          if (guess === word) {
            // Set correct
            correct = true;
            // Send message
            interaction.channel.send(`🎉 Correct! You won ${amount} coins!`);
            // Add coins
            addCoin(interaction, client.db, interaction.user.id, interaction.guild.id, amount);
            // end collector;
            return collector.stop();
          } else if (tries < 3 && correct !== true) {
            // Add to tries
            tries++;
            // Send message
            return interaction.channel.send(`❌ Incorrect! You have ${3 - tries + 1} tries left.`);
          }
          // end collector
          collector.stop();
          // Send message
          return interaction.channel.send(`❌ Incorrect! The correct answer was ${word}.`);
        });
        // On collector end
        collector.on("end", () => {
          // If not correct
          if (!correct && tries < 3) {
            // Send message
            interaction.channel.send(`⏰ Time's up! The correct answer was **${word}**.`);
          }
        });
        break;
      // If subcommand is sort
      case "sort":
        // Shuffle letters
        letters.sort(() => Math.random() - 0.5);
        // Send message
        interaction.reply(`Sort the letters!\n\n${letters}`);
        // On collected message
        collector.on("collect", (collected) => {
          // Get message
          const guess = collected.content.toLowerCase();
          // If guess is correct
          if (guess === word) {
            // Set correct
            correct = true;
            // Send message
            interaction.channel.send(`🎉 Correct! You won ${amount} coins!`);
            // Add coins
            addCoin(interaction, client.db, interaction.user.id, interaction.guild.id, amount);
            // end collector
            return collector.stop();
          } else if (tries < 3 && correct !== true) {
            // Add to tries
            tries++;
            // Send message
            return interaction.channel.send(`❌ Incorrect! You have ${3 - tries + 1} tries left.`);
          }
          // end collector
          collector.stop();
          // Send message
          return interaction.channel.send(`❌ Incorrect! The correct answer was ${word}.`);
        });
        // On collector end
        collector.on("end", () => {
          // If not correct
          if (!correct && tries < 3) {
            // Send message
            interaction.channel.send(`⏰ Time's up! The correct answer was **${word}**.`);
          }
        });
        break;
      default:
        break;
    }
  },
};
