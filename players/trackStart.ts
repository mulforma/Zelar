// Import Queue and Track
import { Queue, Track } from "discord-player";

module.exports = {
  name: "trackStart",
  description: "Triggered when a track starts playing",
  async run(queue: Queue<any>, track: Track) {
    if (queue.repeatMode !== 0) return;
    await queue.metadata.channel.send({
      content: `[🎧] Playing ${track.title}`,
    });
  },
};
