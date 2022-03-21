// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

// Export command
module.exports = {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("coin-flip")
    // Set command description
    .setDescription("Flips a coin and returns the result")
    // Add string option
    .addIntegerOption((option) =>
      option
        // Set name
        .setName("seed")
        // Set description
        .setDescription("Seed for the coin flip generated value"),
    ),
  // Set command category
  category: "Game",
  // Execute function
  /**
   * @param {import('discord.js').Client} client
   * @param {import('discord.js').CommandInteraction} interaction
   * @returns {Promise<void>}
   */
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get seed
    const seed = interaction.options.getInteger("seed") || new Date().getTime();
    // Random number function
    const randomNum = (seedVal) => {
      let s = seedVal;
      const x = Math.sin(s++) * 10000;
      return x - Math.floor(x);
    };
    // Get random number
    const genNum = randomNum(seed) * 100;
    // Check if it's even
    const isEven = Math.trunc(genNum) % 2 === 0;

    // Reply with result
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("🎲 Coin Flip")
          .addField("Result", isEven ? "Heads" : "Tails")
          .addField("Generated Number", String(genNum))
          .addField("Seed", String(seed))
          .setColor(0x00ff00),
      ],
    });
  },
};
