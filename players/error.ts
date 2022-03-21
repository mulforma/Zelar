// Import npmlog
import * as log from "npmlog";
// Import Queue
import { Queue } from "discord-player";

export default {
  name: "error",
  description: "Triggered when an error occurs.",
  run(queue: Queue, error: Error): void {
    log.error("Error!", error.message);
  },
};
