import "dotenv/config";
import { SlashCommandBuilder } from "@discordjs/builders";
import cheerio from "cheerio";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";
import axios from "axios";
import log from "npmlog";

// Search for image
const searchImage = (query: string) => {
  return axios
    .get(`https://www.google.com/search?q=${query}&tbm=isch`)
    .then((response) => {
      const $ = cheerio.load(response.data);
      const [, image] = $("img");
      return image ? image.attribs.src : null;
    })
    .catch((error) => {
      log.info("", error);
    });
};

export default {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search anything!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("image")
        .setDescription("Search for an image")
        .addStringOption((option) =>
          option.setName("query").setDescription("The query to search for").setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("wiki")
        .setDescription("Search wikipedia!")
        .addStringOption((option) =>
          option.setName("query").setDescription("The query to search for").setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("duck")
        .setDescription("Search duckduckgo!")
        .addStringOption((option) =>
          option.setName("query").setDescription("The query to search for").setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("wikidata")
        .setDescription("Search wikidata!")
        .addStringOption((option) =>
          option.setName("query").setDescription("The query to search for").setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("quotes")
        .setDescription("Search wikiquotes!")
        .addStringOption((option) =>
          option.setName("query").setDescription("The query to search for").setRequired(true),
        ),
    ),
  category: "Search",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get query
    const query = interaction.options.getString("query") ?? "";

    // Get subcommand
    switch (interaction.options.getSubcommand()) {
      // If subcommand is an image
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
            const { pages } = response.data.query;
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
            log.error("", error);
          });
        break;
      case "duck":
        // Search in duckduckgo
        axios
          .get(`https://api.duckduckgo.com/?q=${query}&format=json&pretty=1`)
          .then((response) => {
            // Get data
            const { data } = response;
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
            log.error("", error);
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
            const { data } = response;
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
            log.error("", error);
            interaction.reply({
              embeds: [new MessageEmbed().setTitle("Error!").setColor("#ff0000")],
            });
          });
        break;
      default:
    }
  },
};
