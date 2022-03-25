// Import SlashCommandBuilder
const { SlashCommandBuilder } = require("@discordjs/builders");
// Import QueryType from discord-player
const { QueryType } = require("discord-player");

// Export command
export default {
  // Set command data
  data: new SlashCommandBuilder()
    // Set command name
    .setName("play")
    // Set command description
    .setDescription("Add a song to the queue.")
    // Add string option
    .addStringOption((option) =>
      option
        // Set option name
        .setName("song")
        // Set option description
        .setDescription("The song to play.")
        // Set option required
        .setRequired(true),
    ),
  // Set command category
  category: "Music",
  // Execute function
  async execute (client : Client, interaction : CommandInteraction) : Promise<void> {
    // Get query
    const query = interaction.options.getString("song");
    
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
    const queue = await client.player.createQueue(interaction.guild, {
      metadata: interaction,
    });
    
    // Try / Catch
    try {
      // Connect to voice channel
      if (!queue.connection) {
        await queue.connect(interaction.member.voice.channel);
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
