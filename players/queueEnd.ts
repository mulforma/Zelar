import { Queue } from "discord-player";

export default {
  name: "queueEnd",
  description: "Triggered when a queue ends.",
  async run(queue: Queue<any>): Promise<any> {
    await queue.metadata.channel.send({
      content: "Queue ended.",
    });
  },
};
