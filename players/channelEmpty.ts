import { Queue } from "discord-player";

export default {
  name: "channelEmpty",
  description: "Triggered when a channel is empty.",
  async run(queue: Queue<any>): Promise<void> {
    await queue.metadata.channel.send({
      content: "Bot is drop because the channel is empty.",
    });
  },
};
