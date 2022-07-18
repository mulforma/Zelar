import "dotenv/config";
import { SlashCommandBuilder } from "discord.js";
import { Client, ChatInputCommandInteraction, GuildMember, EmbedBuilder } from "discord.js";
import axios from "axios";
import log from "npmlog";

export default {
  data: new SlashCommandBuilder()
    .setName("dictionary")
    .setDescription("Search for a word in the dictionary")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Search for a word from the any dictionary")
        .addStringOption((option) =>
          option.setName("query").setDescription("The query to search for").setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("urban")
        .setDescription("Search for a word from the Urban Dictionary")
        .addStringOption((option) =>
          option.setName("query").setDescription("The query to search for").setRequired(true),
        ),
    ),
  category: "Search",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get query
    const query = interaction.options.getString("query");

    // Get subcommand
    switch (interaction.options.getSubcommand()) {
      // If subcommand is urban
      case "urban": {
        // Get word from Urban Dictionary
        const urban = await axios
          .get(`https://api.urbandictionary.com/v0/define?term=${query}`)
          .then((response) => {
            // Get word
            const [word] = response.data.list;
            // Get word definition
            const wordDefinition = word.definition;
            // Get word example
            const wordExample = word.example;
            // Return word
            return new EmbedBuilder()
              .setTitle(`Urban Dictionary: ${word.word}`)
              .setDescription(wordDefinition)
              .addFields([{ name: "Example", value: wordExample }])
              .setColor("#00ff00")
              .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: (interaction.member as GuildMember)?.displayAvatarURL(),
              });
          })
          .catch((error) => {
            log.error("", error);
            interaction.reply("Something went wrong");
          });
        // Send message
        await interaction.reply({ embeds: [urban as EmbedBuilder] });
        break;
      }
      case "search": {
        // Get word from dictionary
        const dictionary = await axios
          .get(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${query}?ui=en&definitions=true&synonyms=true&antonyms=true&examples=true&audio=true`,
          )
          .then((response) => {
            // Get word
            const [word] = response.data;
            // Get word definition
            const [wordDefinition] = word.meanings[0].definitions;

            // Return word
            return new EmbedBuilder()
              .setTitle(query ?? "")
              .setDescription(wordDefinition.definition)
              .addFields([
                { name: "Origin", value: wordDefinition.origin || "Unknown" },
                { name: "Example", value: wordDefinition.example || "-" },
                { name: "Phonetic", value: word.phonetic || "-" },
                { name: "Synonyms", value: wordDefinition.synonyms.join(", ") || "-" },
                { name: "Antonyms", value: wordDefinition.antonyms.join(", ") || "-" },
              ])
              .setURL(word.phonetics[0].audio.replace("//", "https://"))
              .setColor("#0099ff")
              .setFooter({
                text: `Request by ${interaction.user.tag}`,
                iconURL: interaction.user.avatarURL() ?? undefined,
              })
              .setTimestamp();
          })
          .catch((error) => {
            log.error("", error);
            interaction.reply("Word not found");
          });

        return interaction.reply({ embeds: [dictionary as EmbedBuilder] });
      }
      default:
    }
  },
};
