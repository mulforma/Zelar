// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import getUserData
const getUserData = require("../../function/getUserData");
// Import addCoin
const addCoin = require("../../function/addCoin");
// Import ms
const ms = require("ms");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("weekly")
    // Set command description
    .setDescription("Get your weekly coin."),
  // Set command category
  category: "Economics",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client, interaction) {
    // Get user data
    const userData = await getUserData(interaction, client.db, interaction.user.id, interaction.guild.id);
    // Get user daily coins time
    const lastWeekly = Number(userData.timeout.weekly);
    // Get current date
    const currentDate = new Date().getTime();
    // Weekly coin amount
    const weeklyAmount = 3000;
    // Week in milliseconds
    const week = 604800000;
  
    // If user lasted weekly coin time is less than a day
    if ((currentDate - lastWeekly) < week) {
      // Send message
      interaction.reply(
        `You already got your weekly coins.\nYou can get your coins again in ${ms(week - (currentDate - lastWeekly))}`,
      );
    } else {
      // Add daily coins
      await addCoin(interaction, client.db, interaction.user.id, interaction.guild.id, weeklyAmount);
      // Set new daily time
      userData.timeout.weekly = currentDate;
      // Save user data
      await client.db("user")
        .update("timeout", userData.timeout)
        .where("userId", interaction.user.id)
        .where("serverId", interaction.guild.id);
      // Send message
      interaction.reply(`You got ${weeklyAmount} coins.\nNow you have ${Number(userData.coin) + weeklyAmount} coins.`);
    }
  },
};
