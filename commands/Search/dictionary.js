// Load env
require("dotenv").config();
// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import MessageEmbed from discord.js
const { MessageEmbed } = require("discord.js");
// Import axios
const axios = require("axios");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("dictionary")
    // Set command description
    .setDescription("Search for a word in the dictionary")
    // Add string option
    .addSubcommand((subcommand) =>
      subcommand
        // Set subcommand name
        .setName("search")
        // Set subcommand description
        .setDescription("Search for a word from the any dictionary")
        // Add string option
        .addStringOption((option) =>
          option
            // Set name
            .setName("query")
            // Set description
            .setDescription("The query to search for")
            // Set required
            .setRequired(true)
        )
    ).addSubcommand((subcommand) =>
      subcommand
        // Set subcommand name
        .setName("urban")
        // Set subcommand description
        .setDescription("Search for a word from the Urban Dictionary")
        // Add string option
        .addStringOption((option) =>
          option
            // Set name
            .setName("query")
            // Set description
            .setDescription("The query to search for")
            // Set required
            .setRequired(true)
        )
    ),
  // Set command category
  category: "Search",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute (client, interaction) {
    // Get query
    const query = interaction.options.getString("query");
    
    // Get subcommand
    switch (interaction.options.getSubcommand()) {
      // If subcommand is urban
      case "urban":
        // Get word from Urban Dictionary
        const urban = await axios.get(`http://api.urbandictionary.com/v0/define?term=${query}`).then((response) => {
          // Get word
          const word = response.data.list[0];
          // Get word definition
          const wordDefinition = word.definition;
          // Get word example
          const wordExample = word.example;
          // Return word
          return new MessageEmbed().setTitle(`Urban Dictionary: ${word.word}`).setDescription(wordDefinition).addField("Example", wordExample).setColor("#00ff00").setFooter({
            text: `Requested by ${interaction.message.author.tag}`,
            iconURL: interaction.message.author.displayAvatarURL(),
          });
        }).catch((error) => {
          console.log(error);
          interaction.reply("Something went wrong");
        });
        // Send message
        await interaction.reply({ embeds: [urban] });
        break;
      case "search":
        // Get word from dictionary
        const dictionary = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${query}?ui=en&definitions=true&synonyms=true&antonyms=true&examples=true&audio=true`
        ).then((response) => {
          // Get word
          const word = response.data[0];
          // Get word definition
          const wordDefinition = word.meanings[0].definitions[0].definition;
          // Get word example
          const wordExample = word.meanings[0].definitions[0].example;
          // Get synonyms
          const wordSynonyms = word.meanings[0].definitions[0].synonyms;
          // Get antonyms
          const wordAntonyms = word.meanings[0].definitions[0].antonyms;
          
          // Get word example
          const wordOrigin = word.origin;
          // Return word
          return new MessageEmbed().setTitle(query).setDescription(wordDefinition).addField("Origin", wordOrigin).addField("Example", wordExample).addField("Synonyms", wordSynonyms.join(", ") || "-").addField("Antonyms", wordAntonyms.join(", ") || "-").setColor("#0099ff").setFooter({
            text: `Request by ${interaction.user.tag}`,
            iconURL: interaction.user.avatarURL(),
          }).setTimestamp();
        }).catch((error) => {
          console.log(error);
          interaction.reply("Something went wrong");
        });
        
        await interaction.reply({ embeds: [dictionary] });
    }
  },
};
