import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageEmbed } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("coin-flip")
    .setDescription("Flips a coin and returns the result")
    .addIntegerOption((option) => option.setName("seed").setDescription("Seed for the coin flip generated value")),
  category: "Game",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get seed
    const seed = interaction.options.getInteger("seed") || new Date().getTime();
    // Random number function
    const randomNum = (seedVal: number) => {
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
