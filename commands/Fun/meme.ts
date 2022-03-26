import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import {
  Client,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
} from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("meme").setDescription("Send a meme"),
  category: "Fun",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Fetch meme by axios
    const { data } = await axios.get("https://meme-api.herokuapp.com/gimme");
    // Create new button
    const button = new MessageActionRow().addComponents(
      new MessageButton()
        // Set button label
        .setLabel("Next")
        // Set button id
        .setCustomId("next")
        // Set button styles
        .setStyle("PRIMARY"),
    );
    // Send meme
    await interaction.reply({
      embeds: [new MessageEmbed().setTitle(data.title).setImage(data.url).setURL(data.postLink).setColor("GREEN")],
      components: [button],
    });

    // Filter for answer buttons
    const filter = (i: MessageComponentInteraction) =>
      // Check if id is Confirm and if it is the same user
      i.customId === "next" && i.user.id === interaction.user.id;

    // Collect answer
    const collector = interaction.channel!.createMessageComponentCollector({ filter, time: 60000 });

    // When answer is collected
    collector.on("collect", async (i) => {
      // Check if custom id is next
      if (i.customId === "next") {
        // Defer update
        await i.deferUpdate();
        // Fetch a new meme
        const { data } = await axios.get("https://meme-api.herokuapp.com/gimme");
        // Send meme
        await interaction.editReply({
          embeds: [new MessageEmbed().setTitle(data.title).setImage(data.url).setURL(data.postLink).setColor("GREEN")],
          components: [button],
        });
      }
    });
  },
};
