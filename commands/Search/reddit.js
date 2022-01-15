// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import axios
const axios = require("axios");
// Import MessageEmbed from Discord.js
const { MessageEmbed } = require("discord.js");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("reddit")
    // Set command description
    .setDescription("Search for a subreddit")
    // Add string option
    .addStringOption((option) =>
      // Set option name
      option.setName("subreddit")
        // Set option description
        .setDescription("The subreddit to search")
        // Set option required
        .setRequired(true)
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
    // Get subreddit
    const subreddit = interaction.options.getString("subreddit");
    
    // Fetches the subreddit
    try {
      const { data } = await axios.get(`https://www.reddit.com/r/${subreddit}.json`);
      
      // Get random post
      let post = data.data.children[Math.floor(Math.random() * data.data.children.length)].data;
      
      // Create embed
      const embed = new MessageEmbed()
        // Set title
        .setTitle(`${post.title}`)
        // Set description
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
        embeds: [new MessageEmbed().setColor("#ff0000").setTitle("Error").setDescription("Subreddit not found")],
      });
    }
  },
};
