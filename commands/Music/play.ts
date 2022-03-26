import { SlashCommandBuilder } from "@discordjs/builders";
import { QueryType } from "discord-player";
import { Client, CommandInteraction, GuildMember } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Add a song to the queue.")
    .addStringOption((option) => option.setName("song").setDescription("The song to play.").setRequired(true)),
  category: "Music",
  async execute(client: Client, interaction: CommandInteraction): Promise<void> {
    // Get query
    const query = interaction.options.getString("song")!;

    // Search the song
    const result = await client.player.search(query, {
      requestedBy: interaction.user.id,
      searchEngine: QueryType.AUTO,
    });

    // If the song is not found
    if (!result) {
      await interaction.reply({
        content: "Result not found.",
      });
    }

    // Create queue
    const queue = await client.player.createQueue(interaction.guild!, {
      metadata: interaction,
    });

    // Try / Catch
    try {
      // Connect to voice channel
      if (!queue.connection) {
        await queue.connect((interaction.member as GuildMember)!.voice.channel!);
      }
    } catch (e) {
      // Remove queue
      queue.destroy();
      // Reply
      return interaction.reply({
        content: "Failed to connect to the voice channel.",
      });
    }

    // Add song to queue
    if (result.playlist) {
      queue.addTracks(result.tracks);
    } else {
      queue.addTrack(result.tracks[0]);
    }

    // Play the song
    if (!queue.playing) {
      await queue.play();
    }

    // Reply
    await interaction.reply({
      content: "[💿] Command received.",
      ephemeral: true,
    });
  },
};
