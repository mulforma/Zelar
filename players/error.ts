// Import Queue
import { Queue } from "discord-player";
// Import npmlog
import * as log from "npmlog";

module.exports = {
  name: "error",
  description: "Triggered when an error occurs.",
  run(queue: Queue, error: Error): void {
    log.error("Error!", error.message);
  },
};
