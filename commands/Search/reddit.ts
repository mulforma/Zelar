import { SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { Client, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("reddit")
    .setDescription("Search for a subreddit")
    .addStringOption((option) =>
      // Set option name
      option.setName("subreddit").setDescription("The subreddit to search").setRequired(true),
    ),
  category: "Search",
  async execute(client: Client, interaction: ChatInputCommandInteraction): Promise<any> {
    // Get subreddit
    const subreddit = interaction.options.getString("subreddit");

    // Fetches the subreddit
    try {
      const { data } = await axios.get(`https://www.reddit.com/r/${subreddit}.json`);

      // Get random post
      const post = data.data.children[Math.floor(Math.random() * data.data.children.length)].data;

      // Create embed
      const embed = new EmbedBuilder()
        // Set title
        .setTitle(`${post.title}`)
        .setDescription(`${post.selftext}`)
        // Set footer
        .setFooter({ text: post.subreddit_name_prefixed })
        // Set URL
        .setURL(`https://reddit.com${post.permalink}`)
        // Set timestamp
        .setTimestamp(new Date(post.created_utc * 1000))
        // Set image
        .setImage(post.url || post.thumbnail);

      // Send embed
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      // Send error message
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor("#ff0000").setTitle("Error").setDescription("Subreddit not found")],
      });
    }
  },
};
