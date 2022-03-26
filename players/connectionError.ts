import log from "npmlog";
import { Queue } from "discord-player";

export default {
  name: "connectionError",
  description: "Triggered when an connection error occurs.",
  async run(queue: Queue, error: Error): Promise<void> {
    log.error("Error!", error.message);
  },
};
