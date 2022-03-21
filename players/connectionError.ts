// Import npmlog
import * as log from "npmlog";
// Import Queue
import { Queue } from "discord-player";

export default {
  name: "connectionError",
  description: "Triggered when an connection error occurs.",
  async run(queue: Queue, error: Error): Promise<void> {
    log.error("Error!", error.message);
  },
};
