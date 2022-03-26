import { Queue, Track } from "discord-player";

export default {
  name: "trackAdd",
  description: "Triggered when a track is added to the queue.",
  async run(queue: Queue<any>, track: Track) {
    await queue.metadata.channel.send({
      content: `[🎧] **${track.title}** has been added to the queue.`,
    });
  },
};
