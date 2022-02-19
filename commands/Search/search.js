// Load env
require("dotenv").config();
// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import cheerio
const cheerio = require("cheerio");
// Import MessageEmbed from discord.js
const { MessageEmbed } = require("discord.js");
// Import axios
const axios = require("axios");
// Import npmlog
const log = require("npmlog");

// Search for image
const searchImage = (query) => {
  return axios
    .get(`https://www.google.com/search?q=${query}&tbm=isch`)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const image = $("img")[1];
      return image ? image.attribs.src : null;
    })
    .catch((error) => {
      log.info(error);
    });
};

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("search")
    // Set command description
    .setDescription("Search anything!")
    // Add string option
    .addSubcommand((subcommand) =>
      subcommand
        // Set subcommand name
        .setName("image")
        // Set subcommand description
        .setDescription("Search for an image")
        // Add string option
        .addStringOption((option) =>
          option
            // Set name
            .setName("query")
            // Set description
            .setDescription("The query to search for")
            // Set required
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        // Set subcommand name
        .setName("wiki")
        // Set subcommand description
        .setDescription("Search wikipedia!")
        // Add string option
        .addStringOption((option) =>
          option
            // Set name
            .setName("query")
            // Set description
            .setDescription("The query to search for")
            // Set required
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        // Set subcommand name
        .setName("duck")
        // Set subcommand description
        .setDescription("Search duckduckgo!")
        // Add string option
        .addStringOption((option) =>
          option
            // Set name
            .setName("query")
            // Set description
            .setDescription("The query to search for")
            // Set required
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        // Set subcommand name
        .setName("wikidata")
        // Set subcommand description
        .setDescription("Search wikidata!")
        // Add string option
        .addStringOption((option) =>
          option
            // Set name
            .setName("query")
            // Set description
            .setDescription("The query to search for")
            // Set required
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        // Set subcommand name
        .setName("quotes")
        // Set subcommand description
        .setDescription("Search wikiquotes!")
        // Add string option
        .addStringOption((option) =>
          option
            // Set name
            .setName("query")
            // Set description
            .setDescription("The query to search for")
            // Set required
            .setRequired(true),
        ),
    ),
  // Set command category
  category: "Search",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    // Get query
    const query = interaction.options.getString("query");

    // Get subcommand
    switch (interaction.options.getSubcommand()) {
      // If subcommand is image
      case "image":
        // Search for image
        searchImage(query).then((img) => {
          // If image is not found
          if (!img) {
            interaction.reply({
              embeds: [new MessageEmbed().setTitle("No image found!").setColor("#ff0000")],
            });
          } else {
            interaction.reply({
              embeds: [new MessageEmbed().setTitle(query).setImage(img).setColor(0x00ae86)],
            });
          }
        });
        break;
      // If subcommand is Wiki
      case "wiki":
        // Search in wiki
        axios
          .get(
            `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=&explaintext=&titles=${query}`,
          )
          .then((response) => {
            // Get data
            const pages = response.data.query.pages;
            // If no results
            if (!pages[Object.keys(pages)[0]].extract) {
              interaction.reply({
                embeds: [new MessageEmbed().setTitle("No results found!").setColor("#ff0000")],
              });
            } else {
              // Get the first result
              const result = pages[Object.keys(pages)[0]];
              // Send the result
              interaction.reply({
                embeds: [
                  new MessageEmbed()
                    .setTitle(result.title)
                    .setDescription(
                      `${result.extract.substr(0, result.extract.length >= 500 ? 497 : result.extract.length)}...`,
                    )
                    .setColor(0x00ae86)
                    .setURL(`https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`),
                ],
              });
            }
          })
          .catch((error) => {
            log.error(error);
          });
        break;
      case "duck":
        // Search in duckduckgo
        axios
          .get(`https://api.duckduckgo.com/?q=${query}&format=json&pretty=1`)
          .then((response) => {
            // Get data
            const data = response.data;
            // If no results
            if (!data.AbstractText) {
              interaction.reply({
                embeds: [new MessageEmbed().setTitle("No results found!").setColor("#ff0000")],
              });
            } else {
              // Send the result
              interaction.reply({
                embeds: [
                  new MessageEmbed()
                    .setTitle(data.Heading)
                    .setDescription(data.AbstractText)
                    .setColor(0x00ae86)
                    .setURL(data.AbstractURL),
                ],
              });
            }
          })
          .catch((error) => {
            log.error(error);
            interaction.reply({
              embeds: [new MessageEmbed().setTitle("Error!").setColor("#ff0000")],
            });
          });
        break;
      case "wikidata":
        // Search in wikidata
        axios
          .get(
            `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${query}&language=en&format=json&type=item`,
          )
          .then((response) => {
            // Get data
            const data = response.data;
            // If no results
            if (!data.search) {
              interaction.reply({
                embeds: [new MessageEmbed().setTitle("No results found!").setColor("#ff0000")],
              });
            } else {
              // Send the result
              interaction.reply({
                embeds: [
                  new MessageEmbed()
                    .setTitle(data.search[0].label)
                    .setDescription(data.search[0].description)
                    .setColor(0x00ae86)
                    .setURL(data.search[0].concepturi),
                ],
              });
            }
          })
          .catch((error) => {
            log.error(error);
            interaction.reply({
              embeds: [new MessageEmbed().setTitle("Error!").setColor("#ff0000")],
            });
          });
        break;
      default:
    }
  },
};
