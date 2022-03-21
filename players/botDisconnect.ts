import { Queue } from "discord-player";

export default {
  name: "botDisconnect",
  description: "Triggered when a bot disconnects from the voice channel",
  async run(queue: Queue<any>) {
    await queue.metadata.channel.send({
      content: "The bot was dropped from the voice channel. The queue has been cleared.",
    });
  },
};
