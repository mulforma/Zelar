import { addCoin } from "../../methods/addCoin.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Client, CommandInteraction, MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("rps").setDescription("Play rock paper scissors with the bot."),
  category: "Game",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Set variables
    const rps = ["rock", "paper", "scissors"];
    // Set random coin amount
    const randCoin = Math.floor(Math.random() * 15) + 1;

    // Set button
    const rpsButton = new MessageActionRow().addComponents(
      new MessageButton().setCustomId("rock").setLabel("✊").setStyle("PRIMARY"),
      new MessageButton().setCustomId("paper").setLabel("✋").setStyle("PRIMARY"),
      new MessageButton().setCustomId("scissors").setLabel("✌").setStyle("PRIMARY"),
    );

    // RPS result
    const result = rps[Math.floor(Math.random() * rps.length)];

    // Filter for input
    const filter = (i: MessageComponentInteraction) =>
      i.customId === "rock" ||
      i.customId === "paper" ||
      (i.customId === "scissors" && i.user.id === interaction.user.id);

    // Listen for input
    const collector = interaction.channel!.createMessageComponentCollector({
      filter,
      time: 10000,
    });

    // Reply
    await interaction.reply({
      content: "Choose rock, paper, or scissors!",
      components: [rpsButton],
    });

    // On input
    collector.on("collect", async (i) => {
      await i.deferUpdate();

      // Check the result
      if (result === i.customId) {
        // Reply
        await interaction.editReply({
          content: `[🧑] You choose **${i.customId}**\n[🤖] I choose **${result}**\nResult : **You tied!**`,
          components: [],
        });
      } else if (
        (i.customId === "rock" && result === "scissors") ||
        (i.customId === "paper" && result === "rock") ||
        (i.customId === "scissors" && result === "paper")
      ) {
        // Reply
        await interaction.editReply({
          content: `[🧑] You choose **${i.customId}**\n[🤖] I choose **${result}**\nResult : **You win!**\nYou won **${randCoin} coins!**`,
          components: [],
        });

        // Add coins
        await addCoin(interaction, client.db, interaction.user.id, interaction.guild!.id, randCoin);
      } else {
        // Reply
        await interaction.editReply({
          content: `[🧑] You choose **${i.customId}**\n[🤖] I choose **${result}**\nResult : **You lose!**`,
          components: [],
        });
      }
    });
  },
};
